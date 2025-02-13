namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryRacingConfiguration
    {
        public int RaceStageFlipTime { get; }
        public int GoingAndRacingPostPickFlipTime { get; }
        public RacingAssetConfig RunnerCountConfig { get; }
        public SplitScreenConfiguration SplitScreenConfig { get; }

    }
    public class GantryRacingConfiguration : IGantryRacingConfiguration
    {
        public int RaceStageFlipTime { get; set; }
        public int GoingAndRacingPostPickFlipTime { get; set; }
        public RacingAssetConfig RunnerCountConfig { get; set; }
        public SplitScreenConfiguration SplitScreenConfig { get; set; }

    }

    public class RangeObject
    {
        public List<int> Range { get; set; }
        public string TemplateClass { get; set; }
    }

    public class RacingAssetConfig
    {
        public List<RangeObject> Half { get; set; }
        public List<RangeObject> FullAndQuad { get; set; }
    }

    public class SplitScreenConfiguration
    {
        public SplitScreenFullAndQuad FullAndQuad { get; set; }
        public SplitScreenFullAndQuad Half { get; set; }
    }

    public class SplitScreenFullAndQuad
    {
        public Options Options { get; set; }
        public List<SplitScreenRunner> Runners { get; set; }
    }

    public class SplitScreenRunner
    {
        public int RunnerNumber { get; set; }
        public List<Page> Pages { get; set; }
    }

    public class Options
    {
        public int SplitScreenTemplatesInitialRunner { get; set; }
        public int splitScreenTemplatesScrollEnableAt { get; set; }
        public int splitScreenTemplatesMaxPages { get; set; }
        public int splitScreenTemplateFixedSelections { get; set; }
    }

    public class Page
    {
        public int PageNumber { get; set; }
        public int StartPageIndex { get; set; }
        public int EndPageIndex { get; set; }
        public int TotalRunners { get; set; }
        public string TemplateClass { get; set; }
    }


}
