using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class MultiEventPreviewDetails
    {
        public List<RacingEvent> racingEvents { get; set; }
        public string target { get; set; }
        public string targetFolderId { get; set; }
        public string name { get; set; }
        public string tabName { get; set; }
        public string labelName { get; set; }
        public bool isPageDoesNotDependsOnEvents { get; set; }
    }
    public class RacingEvent
    {
        public int typeId { get; set; }
        public string typeName { get; set; }
        public string categoryCode { get; set; }
        public string className { get; set; }
        public object marketsWhichAreDropped { get; set; }
        public List<Market>? markets { get; set; }
        public bool isStandardTemplatesLoaded { get; set; }
        public bool isExpandable { get; set; }
        public bool @virtual { get; set; }
        public string tabName { get; set; }
        public object targetLink { get; set; }
        public bool isMeetingPages { get; set; }
        public object meetingPageRelativePath { get; set; }
        public object eventSortCode { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public object startTime { get; set; }
        public string omniaUrl { get; set; }
        public object eventName { get; set; }
    }

}