namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class SiteCoreItemDetailsMessage
    {
        public string ItemId { get; set; }
        public string Path { get; set; }
        public string Language { get; set; }
        public string Revision { get; set; }
        public string Operation { get; set; }
        public string TemplateName { get; set; }
    }
}