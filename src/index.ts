import fetch from "cross-fetch";
import * as cheerio from "cheerio";
import { OwnedEthereumName, SearchResult, Transaction } from "./types";

export async function lookup(searchText: string): Promise<SearchResult> {
  const params = new URLSearchParams();

  params.append("search", searchText);

  const response = await fetch(
    `https://etherscan.io/enslookup-search?${params.toString()}`
  );

  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const ensResult = $("#ContentPlaceHolder1_ensNameResult");
  const addressResult = $("#ContentPlaceHolder1_addressResult");
  const errorNotFound = $("#ContentPlaceHolder1_errorContainer");

  if (errorNotFound.length > 0) {
    return {
      found: false,
    };
  }

  if (addressResult.length > 0) {
    const ens = addressResult.find(".card-body .row").first().find("a").text();
    const registrant = addressResult
      .find(".card-body .row")
      .last()
      .find("a")
      .text();

    const ownedEnsTable = addressResult.find("#ownedEthNamesTable");
    let ownedEns: OwnedEthereumName[] = [];

    const forwardsTable = addressResult.find("#resolvedAddressTable");
    let forwardedEns: string[] = [];

    if (ownedEnsTable.length > 0) {
      ownedEns = ownedEnsTable
        .find("tbody tr")
        .map((i, el) => {
          const $el = $(el);
          const ens = $($el.find("td").get(0)).text();
          const expiration = $($el.find("td").get(1)).find("span").text();

          return {
            ens,
            expiration,
          };
        })
        .get();
    }

    if (forwardsTable.length > 0) {
      forwardedEns = forwardsTable
        .find("tbody tr")
        .map((i, el) => {
          const $el = $(el);
          const name = $($el.find("td").get(0)).text();

          return name;
        })
        .get();
    }

    return {
      found: true,
      ens,
      registrant,
      ownedEns,
      forwardedEns,
    };
  }

  if (ensResult.length > 0) {
    const address = ensResult
      .find("#ContentPlaceHolder1_divResolvedAddress #txtEthereumAddress")
      .first()
      .text();

    const nameCard = ensResult.find(".card").first();

    const controller = nameCard.find("#ensControllerId").first().text();
    const registrant = nameCard.find("#ensRegistrantId").first().text();
    const expiration = $(nameCard.find(".row").get(1)).find(".col-md-9").text();
    const tokenId = $(nameCard.find(".row").get(3)).find(".col-md-9").text();

    const transactionCard = ensResult.find(".card").last();

    const transactions: Transaction[] = transactionCard
      .find("table tbody tr")
      .map((i, el) => {
        const transactionRow = $(el);

        return {
          id: transactionRow.find("td").first().text(),
          date: $(transactionRow.find("td").get(1)).text(),
          from: $(transactionRow.find("td").get(2)).text(),
          action: $(transactionRow.find("td").get(3)).text(),
        } as Transaction;
      })
      .get();

    return {
      found: true,
      address,
      controller,
      registrant,
      expiration,
      tokenId,
      transactions,
    };
  }

  return {
    found: false,
  };
}

export default lookup;
