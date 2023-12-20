import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

export default function App() {
  const [db, setDb] = useState(null);
  const [table, setTable] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const privateKey =
          "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
        const wallet = new Wallet(privateKey);
        const provider = getDefaultProvider("http://localhost:8545");
        const signer = wallet.connect(provider);
        // Connect to the database
        const db = new Database({ signer });
        return db;
      } catch (error) {
        console.error(error);
      }
    };

    const init = async () => {
      const database = await initDb();
      setDb(database);
    };
    init();
  }, []);

  const createTable = async () => {
    const { meta } = await db
      .prepare("create table my_table (id integer primary key, val text)")
      .all();
    await meta.txn?.wait();
    const [name] = meta.txn.names ?? "";
    setTable(name);
  };

  const writeTable = async () => {
    const { meta } = await db
      .prepare(`insert into ${table} (val) values (?)`)
      .bind("hello world")
      .all();
    await meta.txn?.wait();
    const { results } = await db.prepare(`select * from ${table}`).all();
    setData(results);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable style={styles.button} onPress={createTable}>
        <Text>Create Table</Text>
      </Pressable>
      <Text>Table: {table}</Text>
      <Text />
      <Pressable style={styles.button} onPress={writeTable}>
        <Text>Write Data</Text>
      </Pressable>
      <Text>
        Data:{" "}
        {data &&
          data.map((v) => {
            return JSON.stringify(v);
          })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#75b6b5",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});
