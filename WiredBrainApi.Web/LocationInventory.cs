using System.Diagnostics.CodeAnalysis;

namespace WiredBrainApi
{
    [ExcludeFromCodeCoverage]
    public class LocationInventory
    {
        public int Id { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public decimal KgDarkRoast { get; set; }
        public decimal KgMediumRoast { get; set; }
        public decimal KgLightRoast { get; set; }
        public decimal KgSeasonalRoast { get; set; }
        
    }
}
