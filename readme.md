# Normalized Data Structure

A very simple library to make it easier to work with [Redux Normalizing State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape/), in an immutable way.

Written in typescript.

## Structure

`byId`: Simple "dictionary", where the object key is the items unique identifier
`allIds`: Array of all unique identifiers

## Usage

- `empty<T>`: create a new normalized data structure of type `T`.  Ex: `{ byId: {}, allIds: [] }`
- `forEach`: loop through each item
- `map`: map items returning a new Array
- `filter`: filter items, returning a new Array
- `set`: add an item by key, over-writing any previous item
- `addItems`: add a array of items to the structure.  Takes either a `keyof T` or a selector function that returns a string to specify the structure `key`.
- `removeItem`: Remove item by key
- `fromArray`: creates a new "normalized" object from an array.  Takes either a `keyof T` or a selector function that returns a string to specify the structure `key`.
- `toArray`: get all items as an array

