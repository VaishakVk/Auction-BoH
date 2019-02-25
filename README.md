# Auction API

## Authentication
Basic Authentication is implemented.
Pass the Email and Password in Authorization section with Type Basic Auth

## Routes

### GET

**/api/item** - Query the details of items

Takes three values- 
ACTIVE - All items availabe for bidding currently
UPCOMING - All items that will be available for bidding in the future
PREVIOUS - All items that are already auctioned.

#### Sample Payload
```
{
	"itemType": "ACTIVE" 
}
```
**/api/item/{itemName}** - Query detail of a particular item (No payload)


**/api/bid** - Query bids made by a user (No payload)

### POST

**/api/user** - Create a user

#### Sample payload
```
	{
		"email":"vkvoracle@gmail.com",
		"password":"Hello",
		"fullName":"Vaishak VK"
	}
```
**/api/item** - Create an item  (To be authorized)

#### Sample payload
```
	{
		"name":"Car 18",
		"itemDescription":"Good Car",
		"startTime":"2019-02-24 22:00:00",
		"endTime":"2019-02-26 00:54:00",
		"startingAmount":"10000"
	}
```
**/api/bid** - Make a bid

#### Sample payload (to be authorized)
```
	{
		"item":"Car 7",
		"amount":"150001"
	}
```

## Assumptions

- Any user can create auction item
- No Forget Password option
- All items would be unique. Havent included logic to check the item uniqueness since in real world we would be using Id
- Schedule run every one hour - to reduce the load on server.