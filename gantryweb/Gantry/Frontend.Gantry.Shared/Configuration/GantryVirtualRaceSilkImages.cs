using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryVirtualRaceSilkImages
    {
        public string AvrHorsesImageUrl { get; }
        public string AvrGreyhoundsImageUrl { get; }
        public string ChampionsImageUrl { get; }
        public string GeneralImageUrl { get; }
        public string SISHorsesImageUrl { get; }
        public string SISGreyhoundsImageUrl { get; }
        public string EvrHorsesImageUrl { get; }
        public string EvrUsImageUrl { get; }
        public string MotorImageUrl { get; }
        public Dictionary<string, string> VirtualSilksMappingBasedOnMeetingNames { get; }

    }
    public class GantryVirtualRaceSilkImages : IGantryVirtualRaceSilkImages
    {
        public string AvrHorsesImageUrl { get; set; }
        public string AvrGreyhoundsImageUrl { get; set; }
        public string ChampionsImageUrl { get; set; }
        public string GeneralImageUrl { get; set; }
        public string SISHorsesImageUrl { get; set; }
        public string SISGreyhoundsImageUrl { get; set; }
        public string EvrHorsesImageUrl { get; set; }
        public string EvrUsImageUrl { get; set; }
        public string MotorImageUrl { get; set; }
        public Dictionary<string, string> VirtualSilksMappingBasedOnMeetingNames { get; set; }
    }
}