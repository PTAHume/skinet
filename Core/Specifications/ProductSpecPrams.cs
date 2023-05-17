namespace Core.Specifications;

public class ProductSpecPrams
{
    private const int MaxPageSize = 50;
    public int PageIndex { get; set; } = 1;
    private int? _pageSize;
    public int? PageSize 
    {
        get => _pageSize;
        set => _pageSize = (value.Value > MaxPageSize) ? MaxPageSize : value.Value;
    }
    public int? BrandId { get; set; }
    public int? TypeId { get; set; }
    public string Sort { get; set; }
    private string _search;
    public string Search
    {
        get => _search;
        set => _search = value.ToLower();
    }
}