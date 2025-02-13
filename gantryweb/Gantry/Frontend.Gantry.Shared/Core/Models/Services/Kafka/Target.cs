using Frontend.Gantry.Shared.Core.Common.Constants;

namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class Target
    {
        public string brand { get; set; } = ConstantsPropertyValues.Star;
        public string location { get; set; } = ConstantsPropertyValues.DisplayPc;
        public string shop { get; set; } = ConstantsPropertyValues.Star;
        public string device { get; set; } = ConstantsPropertyValues.Star;
        public string[]? groups { get; set; }
    }
}