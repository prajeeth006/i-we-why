using NUnit.Framework;
using NUnit.Framework.Legacy;
using System;
using System.Web;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore.Tests
{
    [TestFixture]
    public class GantryUrlServiceTests
    {
        private GantryUrlService _gantryUrlService;

        [SetUp]
        public void SetUp()
        {
            _gantryUrlService = new GantryUrlService(null, null, null);
        }

        [Test]
        public void HandleRacingAssetType_WithSpecificUrl_RemovesEmptyQueryParameters()
        {
            // Arrange
            var uriBuilder = new UriBuilder("https://gantry.coral.co.uk:443/en/gantry/horseracing/latestdesign/rc")
            {
                Query = "eventId=6044547&marketIds=174662623&racingAssetType=QuadScreenSplit&startPageIndex=1&endPageIndex=8&maxRunnerCount=15&totalPages=2&currentPage=1"
            };

            // Act
            _gantryUrlService.HandleRacingAssetType(uriBuilder);

            // Assert
            var resultQuery = HttpUtility.ParseQueryString(uriBuilder.Query);

            ClassicAssert.IsTrue(resultQuery["eventId"] == "6044547");
            ClassicAssert.IsTrue(resultQuery["marketIds"] == "174662623");
            ClassicAssert.IsTrue(resultQuery["racingAssetType"] == "QuadScreenSplit");
            ClassicAssert.IsTrue(resultQuery["startPageIndex"] == "1");
            ClassicAssert.IsTrue(resultQuery["endPageIndex"] == "8");
            ClassicAssert.IsTrue(resultQuery["maxRunnerCount"] == "15");
            ClassicAssert.IsTrue(resultQuery["totalPages"] == "2");
            ClassicAssert.IsTrue(resultQuery["currentPage"] == "1");

            // Ensure no parameters are empty or removed unless intended by the method logic
            ClassicAssert.IsTrue(resultQuery.Count == 8);
        }
    }
}
