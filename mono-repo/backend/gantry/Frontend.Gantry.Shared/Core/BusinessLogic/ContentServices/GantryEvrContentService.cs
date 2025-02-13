using Frontend.Gantry.Shared.Configuration;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IGantryEvrContentService
    {
        int GetEvrOffPageDelay();
        bool CheckEvrByTypeId(string typeId);
    }
    public class GantryEvrContentService : IGantryEvrContentService
    {
        private readonly IGantryEvrConfiguration _evrTypeIdList;

        public GantryEvrContentService(IGantryEvrConfiguration evrTypeIdList)
        {
            _evrTypeIdList = evrTypeIdList;
        }

        public int GetEvrOffPageDelay()
        {
            if (_evrTypeIdList != null) {
                if (_evrTypeIdList.evrTypeIds != null)
                {
                    return _evrTypeIdList.evrOffPageDelayTime;
                }
            }
            return 0;
        }

        public bool CheckEvrByTypeId(string typeId)
        {
            if (_evrTypeIdList != null)
            {
                if (_evrTypeIdList.evrTypeIds != null && _evrTypeIdList.evrTypeIds.Contains(typeId))
                {
                    return true;
                }
            }
            return false;
        }
    }
}