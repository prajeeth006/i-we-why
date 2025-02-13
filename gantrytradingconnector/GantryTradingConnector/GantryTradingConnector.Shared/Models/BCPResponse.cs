using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace GantryTradingConnector.Shared.Models
{

    [XmlRoot("Event", Namespace = "http://xmlns.bwinparty.com/types/BetContentProvider/v1")]
    public class Event : BaseResponse
    {
        public int Id { get; set; }
        public int? Version { get; set; }
        public int? EventGroupId { get; set; }
        public DateTime? EventDateUtc { get; set; }
        public DateTime? OpenDateUtc { get; set; }
        public DateTime? CutoffDateUtc { get; set; }
        public string PublishedState { get; set; }
        public bool IsPostponed { get; set; }

        [XmlElement("Markets")]
        public Markets? Markets { get; set; }

    }

    public class Markets
    {
        [XmlElement("Market")]
        public List<Market>? Market { get; set; }
    }

    public class Market
    {
        public int Id { get; set; }
        public bool? IsVisible { get; set; }
        public bool? IsLive { get; set; }
        public bool? IsDeletable { get; set; }
        public int? TemplateId { get; set; }
        public string Name { get; set; }
        public string AggregatedVisibility { get; set; }
        public string CategoryName { get; set; }
        public string FormattedName { get; set; }
        public string CategoryFormattedName { get; set; }

        [XmlElement("Options")]
        public Options? Options { get; set; }

    }

    public class Options
    {
        [XmlElement("Option")]
        public List<Option>? Option { get; set; }
    }

    public class Option
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? Order { get; set; }
        public string AggregatedVisibility { get; set; }
        public string FormattedName { get; set; }
    }
}
