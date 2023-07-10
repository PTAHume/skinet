namespace Core.Entities.OrderAggregate;

public class Address
{
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string Street { get; set; }
	public string City { get; set; }
	public string County { get; set; }
	public string Country { get; set; }
	public string PostCode { get; set; }

    public Address
        (string firstName, string lastName,
        string street, string city, string county, string country, string postCode) =>
        (FirstName, LastName, Street, City, County, Country, PostCode) =
        (firstName, lastName, street, city, county, country, postCode);
    public Address() { }
}