using Frontend.Gantry.Shared.Configuration;
namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IGantryAvrConfigService
    {
        bool CheckAvrByTypeId(string typeId);
    }
    public class GantryAvrConfigService : IGantryAvrConfigService
    {
        private readonly IGantryAvrConfiguration _avrTypeIdList;

        public GantryAvrConfigService(IGantryAvrConfiguration avrTypeIdList)
        {
            _avrTypeIdList = avrTypeIdList;
        }

        public bool CheckAvrByTypeId(string typeId)
        {
            if (_avrTypeIdList.avrTypeIds.Contains(typeId))
            {
                    return true;
            }
             return false;
        }
    }
}