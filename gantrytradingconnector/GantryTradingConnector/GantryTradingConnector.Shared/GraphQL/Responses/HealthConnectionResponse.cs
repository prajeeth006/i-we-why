namespace GantryTradingConnector.Shared.GraphQL.Responses
{
    public class HealthConnectionResponse
    {
        public string? ServerId { get; set; }
        public string? clientIP { get; set; }
        public string? Environment { get; set; }
        public bool AllPassed { get; set; } = true;
        public string OverallResult => AllPassed ? "CHECK_OK" : "CHECK_FAILED";
        public Dictionary<string, FeatureHealth> Details { get; set; }
    }

    public class FeatureHealth
    {
        public string Description { get; set; }
        public string WhatToDoIfFailed { get; set; }
        public string ExecutionTime { get; set; }
        public bool Passed { get; set; }

        public Details Details { get; set; }
    }

    public class Details
    {
        public string RequestUrl { get; set; }
        public string Response { get; set; }
    }
}
