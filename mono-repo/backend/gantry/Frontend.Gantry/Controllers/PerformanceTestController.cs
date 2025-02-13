using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Frontend.Vanilla.Content;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class PerformanceTestController : BaseApiController
    {
        private readonly IContentService _contentService;

        public PerformanceTestController(IContentService contentService)
        {
            _contentService = contentService;
        }

        [HttpGet("getSimpleText")]
        public IActionResult GetAvrContent()
        {
            return Ok("TestingPerformance");
        }

        [HttpGet("getSitecoreContent")]
        public async Task<IActionResult> GetAvrPageConfiguration()
        {
            ISportsEvent? eventContent = null;
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId("/Gantry/GantryWeb/FootBallContent/Football");
            Content<IDocument> sportEvent = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

            if (sportEvent is SuccessContent<IDocument> { Document: ISportsEvent content })
            {
                eventContent = content;
            }

            return Ok(eventContent);
        }
    }
}