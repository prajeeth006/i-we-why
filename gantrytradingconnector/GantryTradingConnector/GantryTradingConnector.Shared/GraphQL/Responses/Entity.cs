using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.Contracts.Responses
{
    [DataContract]
    public abstract class Entity<T>
    {
        [DataMember]
        public T Id { get; set; }

        [DataMember]
        public string Name { get; set; }
    }

    [DataContract]
    public abstract class CompetitionEntity<T>
    {
        [DataMember]
        public T Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public bool IsLive { get; set; }
    }
}
