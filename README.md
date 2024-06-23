# Print Array Elements from JSON File

This Node.js script reads an array of objects from a JSON file and prints each element's calculated commission. The script is set up to use Webpack for bundling.

## Requirements

- Node.js
- npm (Node Package Manager)

## Setup

1. Ensure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

2. Clone or download this repository to your local machine.

3. Navigate to the project directory.

4. Install the necessary dependencies by running:

    ```sh
    npm install
    ```

## Usage

1. Prepare a JSON file that contains an array of objects. Example `data.json`:

    ```json
    [
      {
        "date": "2024-06-18",
        "user_id": 4,
        "user_type": "natural",
        "type": "cash_out",
        "operation": { "amount": 150.0, "currency": "EUR" }
      },
      {
        "date": "2024-06-19",
        "user_id": 3,
        "user_type": "juridical",
        "type": "cash_in",
        "operation": { "amount": 200.0, "currency": "USD" }
      }
    ]
    ```

2. Save the JSON file in your project directory or any accessible location.

3. Run the script with the path to your JSON file as an argument:

    ```sh
    npm start path/to/your/data.json
    ```

    Replace `path/to/your/data.json` with the actual path to your JSON file.

## Example

If your `data.json` file is in the same directory as the script, you can run the script as follows:

```sh
npm start data.json
