using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IEventFeedConfig
    {
        public string EventsApi { get; }
        public string RacingContentEventsApi { get; }
        public string NonRunnersApi { get; }
        public string EventsResultApi { get; }
        public string MeetingResultsApi { get; }
        public string LatestResultsApi { get; }
        public string RunningOnTotalsApi { get; }
        public string SignalRHubMessageApi { get; }
        public int SignalrRetryTimeOnDisconnect { get; }
        public Dictionary<string,string> AvrVideoUrl { get; }
        public string AvrApi { get; }
        public string MultiEventApi { get; }
        public string EpsApi { get; }
        public int SnapShotDataTimeOut { get; }
    }

    public class EventFeedConfig : IEventFeedConfig
    {
        public string EventsApi { get; set; }
        public string RacingContentEventsApi { get; set; }
        public string NonRunnersApi { get; set; }
        public string EventsResultApi { get; set; }
        public string MeetingResultsApi { get; set; }
        public string LatestResultsApi { get; set; }
        public string RunningOnTotalsApi { get; set; } // gets all types
        public string SignalRHubMessageApi { get; set; } // gets all signalR Messages
        public int SignalrRetryTimeOnDisconnect { get; set; }
        public Dictionary<string, string> AvrVideoUrl { get; set; }
        public string AvrApi { get; set; }
        public string MultiEventApi { get; set; }
        public string EpsApi { get; set; }
        public int SnapShotDataTimeOut { get; set; }
    }
}