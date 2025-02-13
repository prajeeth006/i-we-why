using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{

    public interface ISportContentByItemPathService
    {
        Task<SportContentDetails?> GetContent(string ItemPath);
    }

    public class SportContentByItemPathService : ISportContentByItemPathService
    {
        private readonly IGantryTemplateContentService _gantryTemplateContentService;

        public SportContentByItemPathService(IGantryTemplateContentService gantryTemplateContentService)
        {
            _gantryTemplateContentService = gantryTemplateContentService;
        }

        public async Task<SportContentDetails?> GetContent(string ItemPath)
        {
            SportContentDetails? contentDetails = null;

            ISportsEvent? content = await _gantryTemplateContentService.GetContent(ItemPath);

            if (content != null)
            {
                contentDetails = new SportContentDetails()
                {
                    ContentParameters = content.Content
                };
            }

            return contentDetails;
        }
    }

}
