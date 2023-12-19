import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

export default function App() {
  const [db, setDb] = useState(null);
  const [table, setTable] = useState(null);

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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title="Create Table" onPress={createTable}></Button>
      <Text>Table: {table}</Text>
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
});
