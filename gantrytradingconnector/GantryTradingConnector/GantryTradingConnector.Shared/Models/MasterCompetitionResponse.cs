namespace GantryTradingConnector.Shared.Models
{
    public class MasterCompetitionResponse: BaseResponse
    {
        public List<MasterCompetition> MasterCompetitions { get; set; }
        public List<ExcludedCompetitions> lstExcludedCompetitions { get; set; }
    }
    
    public class MasterCompetition
    {
        public string Id { get; set; }
        public int InternalId { get; set; }
        public CompetitionName Name { get; set; }
        public bool IsActive { get; set; }
        public int RegionId { get; set; }
        public List<string> UsedInTradingPartition { get; set; }
        public string Gender { get; set; }
        public List<CompetitionStages> Stages { get; set; }
        public bool isFixturesAvailableInAdvance { get; set; }
        public ExcludedCompetitions excludedCompetitions { get; set; } = new();
    }

    public class CompetitionName
    {
        public string StringId { get; set; }
        public string Language { get; set; }
        public string Value { get; set; }
    }

    public class CompetitionStages
    {
        public int Id { get; set; }
        public int SportId { get; set; }
        public string StringId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public List<string> UsedInTradingPartition { get; set; }
        public List<CompetitionStages> Groups { get; set; }
    }

    public class ExcludedCompetitions
    {
        public string competitionId { get; set; }
        public string competitionName { get; set;}
    }

}
