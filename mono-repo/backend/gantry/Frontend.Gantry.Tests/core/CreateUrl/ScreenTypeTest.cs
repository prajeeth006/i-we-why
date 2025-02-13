using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace Frontend.Gantry.Shared.Tests.core.CreateUrl
{
    [TestFixture]
    public class ScreenTypeTest
    {
        private ScreenType? _screenType;
        private Mock<ILogger<ScreenType>>? _log;

        [SetUp]
        public void SetUp()
        {
            _log = new Mock<ILogger<ScreenType>>();
            _screenType = new ScreenType(_log.Object);
        }

        [Test]
        public void SetQuadScreenType()
        {
            GantryScreens gantryScreen = new GantryScreens();
            string? result = "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915";
            gantryScreen.screenType = ConstantsPropertyValues.Quad.ToLower();
            result = _screenType?.SetScreenType(gantryScreen, result);
            NUnit.Framework.Legacy.ClassicAssert.IsTrue(result == "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915&screenType=quad");
        }

        [Test]
        public void SetFullScreenType()
        {
            GantryScreens gantryScreen = new GantryScreens();
            string? result = "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915";
            gantryScreen.screenType = ConstantsPropertyValues.Single.ToLower();
            result = _screenType?.SetScreenType(gantryScreen, result);
            NUnit.Framework.Legacy.ClassicAssert.IsTrue(result == "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915&screenType=full");
        }

        [Test]
        public void SetHalfScreenType()
        {
            GantryScreens gantryScreen = new GantryScreens();
            string? result = "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915";
            gantryScreen.screenType = ConstantsPropertyValues.Half.ToLower();
            result = _screenType?.SetScreenType(gantryScreen, result);
            NUnit.Framework.Legacy.ClassicAssert.IsTrue(result == "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915&screenType=half");
        }

        [Test]
        public void SetMulltiScreenType()
        {
            GantryScreens gantryScreen = new GantryScreens();
            string? result = "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915";
            gantryScreen.screenType = ConstantsPropertyValues.Quad.ToLower();
            result = _screenType?.SetScreenType(gantryScreen, result);
            NUnit.Framework.Legacy.ClassicAssert.IsTrue(result == "http://dev.gantry.coral.co.uk/en/gantry/greyhoundsracing?eventId=4448839&marketIds=116663915&screenType=quad");
        }
    }
}
