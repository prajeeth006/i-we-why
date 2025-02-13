using System;
namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    [Serializable]
    public class ScreenGroup
    {
        public string screenTypeId { get; set; } = "Gantry21";
        public string templateUrl { get; set; }
        public int? screenId { get; set; }
        public int? viewId { get; set; } = null;
        public string viewGroup { get; set; }
    }
}