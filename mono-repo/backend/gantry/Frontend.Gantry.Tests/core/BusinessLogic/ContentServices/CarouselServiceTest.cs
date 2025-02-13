using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System.Reflection;
using Frontend.Vanilla.Content;
using Frontend.Gantry.Shared.Configuration;
using Microsoft.AspNetCore.Http;

namespace Frontend.Gantry.Tests.core.BusinessLogic.ContentServices
{
    internal class CarouselServiceTest
    {

        public CarouselService? objCarouselService;

        [SetUp]
        public void Setup()
        {
            objCarouselService = new CarouselService(
            new Mock<IGantryUrlService>().Object,
            new Mock<IGantryUrlsConfig>().Object,
            new Mock<IContentService>().Object,
            new Mock<IHttpContextAccessor>().Object,
            new Mock<IMultiViewRuleService>().Object,
            new Mock<ILogger<MultiViewService>>().Object);
        }

        [Test]
        public void ValidateCarouselUrlWithEventIdMarketId()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing?eventId=4872711&marketIds=134158377", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithEventIdAsNullMarketId()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing?eventId=&marketIds=134158377", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithEventIdMarketIdnull()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing?eventId=4872711&marketIds=", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithTypeId()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing/meetingresults?typeid=1962", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithTypeIdnull()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing/meetingresults?typeid=", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithEventMarketPairs()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing/winning-distance?eventMarketPairs=2807763:87287513,2817105:87762207", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithEventMarketPairsNull()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/horseracing/winning-distance?eventMarketPairs=", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithContentItemId()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/greyhoundsracing/manual?contentItemId=677087CF-3B18-4283-9EE9-4173550B846E", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithContentItemIdNull()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/greyhoundsracing/manual?contentItemId=", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithItemidorpath()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/staticpromotion?itemIdOrPath=66ba8578-dba2-40d1-b87d-7eaa679cdbd4&screenType=full", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithValidateCarouselUrlWithItemidorpathNull()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/staticpromotion?itemIdOrPath=&screenType=full", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(!isValidate);
            }
        }

        [Test]
        public void ValidateCarouselUrlWithValidateCarouselUrlWithoutParam()
        {
            MethodInfo? methodInfo = typeof(CarouselService).GetMethod("ValidateUrl", BindingFlags.NonPublic | BindingFlags.Instance);
            Uri.TryCreate(@"https://qa2.gantry.coral.co.uk/en/gantry/staticpromotion", UriKind.Absolute, out Uri? result);
            if (result != null)
            {
                object[] parameters = { result };
                bool isValidate = Convert.ToBoolean(methodInfo?.Invoke(objCarouselService, parameters));
                NUnit.Framework.Legacy.ClassicAssert.True(isValidate);
            }
        }
    }
}
