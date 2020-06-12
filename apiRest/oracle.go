package main

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"

	_ "github.com/godror/godror"
)

type Configuration struct {
	username    string
	password    string
	database    string
	hostDB      string
	hostConsul  string
	portService string
}

// Obtiene la conexion a la base de datos
func getConnection() *sql.DB {

	config := getProperties()
	db, err := sql.Open("godror", config.username+"/"+config.password+"@"+config.hostDB+"/"+config.database)
	if err != nil {
		panic("Error")
	}

	return db
}

func getProperties() Configuration {

	fileName := "./config-" + environment + ".json"

	jsonFile, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	var data map[string]interface{}
	err = json.Unmarshal(jsonFile, &data)

	var config Configuration

	config.username = data["username"].(string)
	config.password = data["password"].(string)
	config.hostDB = data["hostDB"].(string)
	config.database = data["database"].(string)
	config.hostConsul = data["hostConsul"].(string)
	config.portService = data["portService"].(string)

	return config
}
