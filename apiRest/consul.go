package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
)

type ConsulJson struct {
	Name    string
	ID      string
	Tags    []string
	Address string
	Port    int
	Check   Check
}

type Check struct {
	Name                           string
	ID                             string
	Interval                       string
	DeregisterCriticalServiceAfter string
	TCP                            string
	Timeout                        string
}

func consulRegistration() string {

	config := getProperties()

	var tagFlayer string
	var tagBanner string
	var tagLetter string
	var nameApp string
	var nameHealth string
	portInt, err := strconv.Atoi(config.portService)
	if environment == "prod" {
		tagLetter = "urlprefix-/htmltopdf/v2"
		tagFlayer = "urlprefix-/flyer/find/v2"
		tagBanner = "urlprefix-/banners/find/v2"
		nameApp = "GoApps"
		nameHealth = "GoApps-HeatlhCheck"
	} else {
		tagLetter = "urlprefix-/" + environment + "/htmltopdf/v2 " + "strip=/" + environment
		tagFlayer = "urlprefix-/" + environment + "/flyer/find/v2 " + "strip=/" + environment
		tagBanner = "urlprefix-/" + environment + "/banners/find/v2 " + "strip=/" + environment
		nameApp = environment + "_GoApps"
		nameHealth = environment + "_GoApps-HeatlhCheck"
	}
	hostName, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	IDCustom := environment + "_GoApps-" + hostName + "-" + config.portService
	IDCustomHealth := environment + "_GoApps-" + hostName + "-" + config.portService + "Health"
	IPS := ipHost()
	IPSPort := IPS + ":" + config.portService
	fmt.Println("El servidor se ejecutará con dirección:", config.portService)
	consulReg := &ConsulJson{
		Name:    nameApp,
		ID:      IDCustom,
		Tags:    []string{tagBanner, tagFlayer, tagLetter},
		Address: IPS,
		Port:    portInt,
		Check: Check{
			Name:                           nameHealth,
			ID:                             IDCustomHealth,
			Interval:                       "5s",
			DeregisterCriticalServiceAfter: "10s",
			TCP:                            IPSPort,
			Timeout:                        "15s",
		},
	}

	consulObjM, _ := json.Marshal(consulReg)
	client := &http.Client{}
	path := "http://" + config.hostConsul + "/v1/agent/service/register"
	req, err := http.NewRequest(http.MethodPut, path, bytes.NewBuffer(consulObjM))
	defer req.Body.Close()
	_, err = client.Do(req)
	if err != nil {
		fmt.Printf("El registro en el Consul ha fallado error: %s\n", err)
		return ""
	}
	fmt.Println("Registro en consul completado")

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGTERM, syscall.SIGINT, syscall.SIGKILL)
	go func() {
		sig := <-sigs
		fmt.Println(sig)
		consuldeRegistration(IDCustom, config.hostConsul)
		os.Exit(0)
	}()
	fmt.Println("El servidor está corriendo")
	return config.portService
}

func consuldeRegistration(idService string, hostConsul string) {

	client := &http.Client{}
	IDGet := "http://" + hostConsul + "/v1/agent/service/deregister/" + idService
	req, err := http.NewRequest(http.MethodPut, IDGet, strings.NewReader(""))
	defer req.Body.Close()
	_, err = client.Do(req)
	if err != nil {
		fmt.Printf("El registro en el Consul ha fallado error: %s\n", err)
		return
	}

	fmt.Println("Desregistro en consul completado")
}

func ipHost() (IPS string) {
	ifaces, err := net.Interfaces()
	if err != nil {
		fmt.Printf("Ha fallado la obtención de la IP Host: %s\n", err)
		return
	} else {
		for _, i := range ifaces {
			addrs, err := i.Addrs()
			if err != nil {
				fmt.Printf("Ha fallado la obtención de la IP Host: %s\n", err)
				return
			} else {
				for _, addr := range addrs {
					var ip net.IP
					switch v := addr.(type) {
					case *net.IPNet:
						ip = v.IP
					case *net.IPAddr:
						ip = v.IP
					}
					IPS := ip.String()
					SoS := strings.Index(IPS, "10.")
					if SoS == 0 {
						return IPS
					}
				}
			}
		}
	}
	return
}
