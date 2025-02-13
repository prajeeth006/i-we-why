using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Gantry.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [AllowAnonymous]
    [Route("StaticPromotion")]

    public class StaticPromotionController : Controller
    {      
        private readonly ISiteCoreStaticPromotionService _siteCoreStaticPromotionService;      

        public StaticPromotionController(ISiteCoreStaticPromotionService siteCoreStaticPromotionService)
        {
            _siteCoreStaticPromotionService = siteCoreStaticPromotionService;        
        }     

        public async Task<ActionResult> StaticPromotion(string itemIdOrPath)
        {
            StaticPromotion staticPromotion= await  _siteCoreStaticPromotionService.GetContent(itemIdOrPath);          

            return View(staticPromotion);
        }
    }
}   