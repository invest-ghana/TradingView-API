# Based on TradingView API [![GitHub stars](https://img.shields.io/github/stars/Mathieu2301/TradingView-API.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/Mathieu2301/TradingView-API/stargazers/)

# useTradeView Hook

The `useTradeView` hook is designed to integrate with the TradingView API, providing a way to fetch and utilize trading data within your React application. It encapsulates the logic for managing chart and quote updates, trade decisions, and execution readiness based on TradingView data.

## Installation

This hook is part of the `invest-ghana/TradingView-API` library. To use it in your project, clone the repository and import the hook as shown below.

```bash
git clone https://github.com/invest-ghana/TradingView-API.git
```

## Usage

Here's how you can use the `useTradeView` hook in your React component:

```jsx
import React from 'react';
import { useTradeView } from 'path-to-hooks';

const MyTradingComponent = () => {
  const {
    chartClient,
    chartField,
    quoteField,
    tradeDecision,
  } = useTradeView({
    // Optional props with callbacks
  });

  // Your component logic here

  return (
    // Your component JSX here
  );
};

export default MyTradingComponent;
```

## API

The `useTradeView` hook accepts an optional `props` object with the following properties:

- `onChartUpdate`: Callback function that is called when the chart updates.
- `onQuoteUpdate`: Callback function that is called when the quote updates.
- `checkTradeConditions`: Function that checks the trade conditions based on the provided data.

It returns an object containing the following properties:

- `chartClient`: An instance of the chart client.
- `chartField`: The current chart field data.
- `quoteField`: The current quote field data.
- `tradeDecision`: The current trade decision.

## Hook Logic

The hook sets up a chart client and manages state for chart data, quote data, and trade decisions. It also includes logic to determine whether a trade should be executed based on the current trade decision and quote data.

## Contributing

If you have suggestions for how `useTradeView` could be improved, or want to report a bug, please file an issue on our GitHub repository.

For more information on contributing to this project, please read our contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/invest-ghana/TradingView-API/blob/main/LICENSE) file for details.
```


---

You are currently on the free plan which is significantly limited by the number of requests. To increase your quota you can check available plans following the link [here](https://c7d59216ee8ec59bda5e51ffc17a994d.auth.portal-pluginlab.ai/pricing).
