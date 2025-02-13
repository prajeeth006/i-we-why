namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class PresenceMessage
    {
        public string Sid { get; set; }
        public long Time { get; set; }
        public string Type { get; set; }
        public Target Sender { get; set; }
    }
}