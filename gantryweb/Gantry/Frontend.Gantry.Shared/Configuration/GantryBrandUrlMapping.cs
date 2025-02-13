using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryBrandUrlMapping
    {
        IDictionary<string, string> BrandUrlMapper { get; }
    }

    public class GantryBrandUrlMapping: IGantryBrandUrlMapping
    {
        public IDictionary<string, string> BrandUrlMapper { get; set; }
    }
}