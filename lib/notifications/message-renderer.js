﻿import moment from "moment";

export function renderMessageByFormats(businesses) {
  return {
    html: renderHtmlMessage(businesses),
    text: renderTextMessage(businesses),
    object: renderObject(businesses),
  };
}

function renderObject(businesses) {
  return businesses.map((business) => ({
    id: business.item.item_id,
    name: business.display_name,
    price: business.item.item_price.minor_units / 100,
    quantity: business.items_available,
    pickup: formatInterval(business),
    pickup_start: business.pickup_interval?.start || null,
    pickup_end: business.pickup_interval?.end || null,
    sold_out_at: business.sold_out_at || null,
    link: `https://share.toogoodtogo.com/item/${business.item.item_id}`,
  }));
}

function renderTextMessage(businesses) {
  return businesses
    .map(
      (business) => `${business.display_name}
Price: ${business.item.item_price.minor_units / 100}
Quantity: ${business.items_available}
Pickup: ${formatInterval(business)}`,
    )
    .join("\n\n");
}

function renderHtmlMessage(businesses) {
  return businesses
    .map(
      (business) =>
        `<a href="https://share.toogoodtogo.com/item/${
          business.item.item_id
        }">${business.display_name}</a>
${business.items_available} @ ${business.item.item_price.minor_units / 100}
${business.pickup_interval ? "Pickup: " +formatInterval(business) : ""}
${business.sold_out_at ? "Last sold: " +formatDate(business.sold_out_at) : ""}
`,
    )
    .join("\n\n");
}

function formatInterval(business) {
  if (!business.pickup_interval) {
    return "?";
  }
  const startDate = formatDate(business.pickup_interval.start);
  const endDate = formatDate(business.pickup_interval.end);
  return `${startDate} - ${endDate}`;
}

function formatDate(dateString) {
  return moment(dateString).calendar(null, {
    lastDay: "[Yesterday] HH:mm",
    sameDay: "[Today] HH:mm",
    nextDay: "[Tomorrow] HH:mm",
    lastWeek: "[Last Week] dddd HH:mm",
    nextWeek: "dddd HH:mm",
    sameElse: "L",
  });
}
