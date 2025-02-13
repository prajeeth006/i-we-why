namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class Message
    {
        public string type { get; set; } = "SCREEN_CTRL";
        public Payload payload { get; set; }
    }
}