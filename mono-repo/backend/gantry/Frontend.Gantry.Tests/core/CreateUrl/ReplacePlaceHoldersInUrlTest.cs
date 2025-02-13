using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.Common.RegularExpressions;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using NUnit.Framework.Legacy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Gantry.Tests.core.CreateUrl
{
    [TestFixture]
    public class ReplacePlaceHoldersInUrlTest
    {
        private ReplacePlaceHoldersInUrl? _splitScreen;
        
        private Mock<IRegexForGettingPlaceHolders>? _regexForGettingPlaceHolders;

        [SetUp]
        public void SetUp()
        {
            _regexForGettingPlaceHolders = new Mock<IRegexForGettingPlaceHolders>();
                _splitScreen = new ReplacePlaceHoldersInUrl(_regexForGettingPlaceHolders.Object);
        }
        [Test]

        public void VerifySplitScreen()
        {
            var InputData = new SiteCoreDisplayRuleItemDetails()
            {

                MarketIds = new List<Market> { new Market { id = 174272002 } },
               EventId = "6021619",
                RacingAssetType = "QuadScreenSplit",

                SplitScreen = new SplitScreen()
                {
                    maxRunnerCount = 23,
                    splitScreenEndRange = 8,
                    splitScreenPageNo = 1,
                    splitScreenStartRange = 1,  
                    splitScreenTotalPages = 3,
                }
            };
            string urlResult = @"https://gantry.coral.co.uk/en/gantry/horseracing/latestdesign/rc?eventId={eventid}&marketIds={marketids}&racingAssetType={racingAssetType}&startPageIndex={startPageIndex}&endPageIndex={endPageIndex}&maxRunnerCount={MaxRunnerCount}&totalPages={TotalPages}&currentPage={CurrentPage}";

            _regexForGettingPlaceHolders.Setup(r => r.GetPlaceHolders(It.IsAny<string>())).Returns(
                new List<string> {
                    "{eventid}",
                    "{marketids}",
                    "{racingAssetType}",
                    "{startPageIndex}",
                    "{endPageIndex}",
                    "{MaxRunnerCount}",
                    "{TotalPages}",
                    "{CurrentPage}"
                });
            string expectedResult = $"https://gantry.coral.co.uk/en/gantry/horseracing/latestdesign/rc?eventId=6021619&marketIds=174272002&racingAssetType=QuadScreenSplit&startPageIndex=1&endPageIndex=8&maxRunnerCount=23&totalPages=3&currentPage=1";
            var actualResult = _splitScreen.ReplacePlaceHolders(InputData, urlResult);
            NUnit.Framework.Legacy.ClassicAssert.IsTrue(expectedResult == actualResult);
        }
    }
}
