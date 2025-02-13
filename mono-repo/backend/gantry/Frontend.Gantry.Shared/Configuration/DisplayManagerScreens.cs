namespace Frontend.Gantry.Shared.Configuration
{
    public interface IDisplayManagerScreens
    {
        string ScreensPath { get; }
        public string ScreensPathWithoutLabelName { get; }
        public bool IsMasterGantryEnabled { get; }
    }

    public class DisplayManagerScreens : IDisplayManagerScreens
    {
        public string ScreensPath { get; set; }
        public string ScreensPathWithoutLabelName { get; set; }
        public bool IsMasterGantryEnabled { get; set; }
    }
}