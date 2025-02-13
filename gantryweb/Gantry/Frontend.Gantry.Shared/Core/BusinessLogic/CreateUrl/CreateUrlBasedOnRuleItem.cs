using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl
{
    public interface ICreateUrlBasedOnRuleItem
    {
        Task<Uri> CreateUrl(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails);
        Task<Uri> CreateUrl(string TargetPath);
    }

    public class CreateUrlBasedOnRuleItem : ICreateUrlBasedOnRuleItem
    {
        private readonly ITargetItem _targetItem;

        public CreateUrlBasedOnRuleItem(ITargetItem targetItem)
        {
            _targetItem = targetItem;
        }

        public async Task<Uri> CreateUrl(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails)
        {
                return await _targetItem.GetTargetItem(siteCoreDisplayRuleItemDetails?.TargetItemId);
        }

        public async Task<Uri> CreateUrl(string TargetPath)
        {
            return await _targetItem.GetTargetItem(TargetPath);
        }
    }
}