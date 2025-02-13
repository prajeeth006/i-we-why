using System.Collections.Generic;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using NUnit.Framework;

namespace Frontend.Gantry.Shared.Tests.core.BusinessLogic
{
    class BrandUrlTests
    {
        private BrandUrl _brandUrl;

        [SetUp]
        public void SetUp()
        {
            _brandUrl = new BrandUrl(null);
        }

        [Test]
        public void ShouldReturnladbrokesBrandUrl()
        {
            var result = _brandUrl.GetBrandUrl(GetSiteCoreItemDetails(), GetBrandUrlMapper(),
                "/Beta-Gantry/DisplayManager/DisplayRightPanel");

            Assert.IsTrue(result == "gantry.ladbrokes.com");
        }

        [Test]
        public void ShouldReturnCoralBrandUrl()
        {
            var result = _brandUrl.GetBrandUrl(GetSiteCoreItemDetails("prod"), GetBrandUrlMapper(),
                "/Gantry/DisplayManager/DisplayRightPanel");

            Assert.IsTrue(result == "gantry.coral.co.uk");
        }

        private string GetSiteCoreItemDetails(string env = "beta")
        {
            if (env == "beta")
            {
                return
                    "{\"ItemId\":\"f2103003-fa8e-4b13-b1bc-b6526fceb827\",\"Path\":\"/sitecore/content/Beta-Gantry/DisplayManager/DisplayRightPanel//Ladbrokes/Row2/Screen2/Rules/2023/1/19/746c19de_WinorEachWayTop2Finish\",\"Language\":\"en\",\"Revision\":\"1915711d-cc91-4f12-b790-3a5ec06a2d3a\",\"Operation\":\"AddOrUpdate\",\"LastUpdateTime\":\"2023-01-19T14:15:52.4807651Z\"}";
            }

            return
                "{\"ItemId\":\"f2103003-fa8e-4b13-b1bc-b6526fceb827\",\"Path\":\"/sitecore/content/Gantry/DisplayManager/DisplayRightPanel/Coral/Row2/Screen2/Rules/2023/1/19/746c19de_WinorEachWayTop2Finish\",\"Language\":\"en\",\"Revision\":\"1915711d-cc91-4f12-b790-3a5ec06a2d3a\",\"Operation\":\"AddOrUpdate\",\"LastUpdateTime\":\"2023-01-19T14:15:52.4807651Z\"}";

        }

        private Dictionary<string, string> GetBrandUrlMapper()
        {
            var BrandUrlMapper = new Dictionary<string, string>();
            BrandUrlMapper.Add("ladbrokes", "gantry.ladbrokes.com");
            BrandUrlMapper.Add("coral", "gantry.coral.co.uk");
            BrandUrlMapper.Add("ladbrokesuk", "gantry.ladbrokes.com");

            return BrandUrlMapper;
        }
    }
}
