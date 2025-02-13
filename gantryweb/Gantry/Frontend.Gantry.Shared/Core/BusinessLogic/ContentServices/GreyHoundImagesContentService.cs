using Bwin.Vanilla.Content.Model;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{
    public interface IGreyHoundImagesContentService
    {
        GreyHoundImages GetImages(string country, bool isSquareImage, bool is2XImage);
    }
    public class GreyHoundImagesContentService : IGreyHoundImagesContentService
    {
        private readonly IGantryGreyhoundSilkImages _gantryGreyhoundSilkImages;
        public GreyHoundImagesContentService(IGantryGreyhoundSilkImages gantryGreyhoundSilkImages)
        {
            _gantryGreyhoundSilkImages = gantryGreyhoundSilkImages;
        }

        public GreyHoundImages GetImages(string country, bool isSquareImage, bool is2XImage)
        {
            _gantryGreyhoundSilkImages.CountryCodes.TryGetValue(country, out string countryCode);

            GreyHoundImages greyHoundImages = new GreyHoundImages();

            string imageUrl = is2XImage ? isSquareImage ? _gantryGreyhoundSilkImages.Square2XImageUrl.Replace("{country}", countryCode?.ToLower()) : _gantryGreyhoundSilkImages.Rectangle2XImageUrl.Replace("{country}", countryCode?.ToLower()) : isSquareImage ? _gantryGreyhoundSilkImages.SquareImageUrl.Replace("{country}", countryCode?.ToLower()) : _gantryGreyhoundSilkImages.RectangleImageUrl.Replace("{country}", countryCode?.ToLower());

            for (int i = 1; i < 11; i++)
            {
                greyHoundImages.RunnerImages.Add(new ContentImage(imageUrl.Replace("{trap_number}", i.ToString()), i.ToString(), 0, 0));
            }

            return greyHoundImages;
        }

    }
}