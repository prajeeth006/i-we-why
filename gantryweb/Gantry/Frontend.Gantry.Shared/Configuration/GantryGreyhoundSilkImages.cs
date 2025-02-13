using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryGreyhoundSilkImages
    {
        public IDictionary<string, string> CountryCodes { get; }
        public string Rectangle2XImageUrl { get; }
        public string RectangleImageUrl { get; }
        public string Square2XImageUrl { get; }
        public string SquareImageUrl { get; }
    }
    public class GantryGreyhoundSilkImages : IGantryGreyhoundSilkImages
    {
        public IDictionary<string, string> CountryCodes { get; set; }
        public string Rectangle2XImageUrl { get; set; }
        public string RectangleImageUrl { get; set; }
        public string Square2XImageUrl { get; set; }
        public string SquareImageUrl { get; set; }
    }
}