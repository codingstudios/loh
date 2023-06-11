export const addRelay = ({ axios, chalk, error, logo, args, storage }) => {
  var storageData = storage.get();
  args = args.addrelay;
  console.log(`
    ${logo()}
    ${chalk.green("Relays Count:")} ${chalk.yellow.bold(
    (storageData?.relays && storageData?.relays.length) || "None"
  )}
    ${
      typeof args != "string"
        ? `Run ${chalk.dim(`loh --setrelay <url@password>`)} to add a relay`
        : ""
    }`);
  if (typeof args != "string") return;
  const [url, password] = args.split("@");
  return axios({
    url,
    method: "POST",
    data: {
      password,
      url: "https://loh.js.org",
      method: "GET",
    },
  })
    .then(async ({ status, data }) => {
      if (status != 200 || !data.includes("loh"))
        return error(
          "Relay invalid, failed to add relay",
          "RELAY",
          `${chalk.green(`loh --addrelay <url@password>`)}`
        );
      if (!storageData?.relays) storageData.relays = [];
      storageData.relays.push(args);
      storageData.relays = [...new Set(storageData.relays)];
      storage.save().then(() =>
        console.log(`    ${chalk.green(
          "Relay added successfully:"
        )} ${chalk.yellow.bold(args)}
        `)
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeRelay = ({ chalk, error, storage, args }) => {
  if (typeof args?.removerelay != "string")
    console.log(`
    Run ${chalk.dim(`loh --removerelay <url>`)} to remove a relay
    `);
  const storageData = storage.get();
  if (
    !Array.isArray(storageData?.relays) ||
    !storageData?.relays.find((relay) => relay.startsWith(args.removerelay))
  ) {
    return error(
      "No relay found",
      `RELAY`,
      `${chalk.green(`loh --removerelay <url>`)}`
    );
  } else {
    storageData.relays.splice(
      storageData.relays.indexOf(
        storageData.relays.find((relay) => relay.startsWith(args.removerelay))
      ),
      1
    );
    storage.save().then(() =>
      console.log(`    
    ${chalk.green("Relay removed successfully:")} ${chalk.yellow.bold(
        args.removerelay
      )}
    `)
    );
  }
};

export const listRelays = ({ chalk, logo, storage }) => {
  const storageData = storage.get();
  console.log(`
    ${logo()}
    ${chalk.green("Relays Count:")} ${chalk.yellow.bold(
    (storageData?.relays && storageData?.relays.length) || "None"
  )}
    ${
      Array.isArray(storageData?.relays)
        ? storageData?.relays
            .map(
              (relay, index) => `
    ${chalk.green(index + 1 + ".")} ${chalk.yellow.bold(relay)}`
            )
            .join("")
        : ""
    }
    `);
};
