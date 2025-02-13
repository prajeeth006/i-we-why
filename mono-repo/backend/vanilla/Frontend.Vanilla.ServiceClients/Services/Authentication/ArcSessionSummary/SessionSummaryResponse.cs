#pragma warning disable CS1591 // Just dummy data -> no docs needed
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;

public sealed class SessionSummaryResponse(string aggregationType, SessionSummary sessionSummary)
{
    public string AggregationType { get; set; } = aggregationType;
    public SessionSummary SessionSummary { get; set; } = sessionSummary;
}

public sealed class SessionSummary
{
    public int CurrentAverage { get; set; }
    public int PastAverage { get; set; }
    public ProductCumulative ProductCumulative { get; set; }
    public List<Segregation> Segregation { get; set; }
}

public class Active
{
    public int Sportsbook { get; set; }
    public int Poker { get; set; }
    public int Casino { get; set; }
    public int Bingo { get; set; }
}

public class Passive
{
    public int Sports { get; set; }
    public int Poker { get; set; }
    public int Casino { get; set; }
    public int Bingo { get; set; }
}

public class ProductCumulative
{
    public Active Active { get; set; }
    public Passive Passive { get; set; }
}

public class Segregation
{
    public string Index { get; set; }
    public Active Active { get; set; }
    public Passive Passive { get; set; }
}
