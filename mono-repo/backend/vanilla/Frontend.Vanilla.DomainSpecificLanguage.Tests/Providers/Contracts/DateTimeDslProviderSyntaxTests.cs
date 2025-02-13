using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class DateTimeDslProviderSyntaxTests : SyntaxTestBase<IDateTimeDslProvider>
{
    [Fact]
    public void DayOfWeekUtc_Test()
    {
        Provider.Setup(p => p.GetUtcDayOfWeek()).Returns("Monday");
        EvaluateAndExpect("DateTime.UtcDayOfWeek", "Monday");
    }

    [Fact]
    public void TodayUtc_Test()
    {
        Provider.Setup(p => p.GetUtcToday()).Returns(369m);
        EvaluateAndExpect("DateTime.UtcToday", 369m);
    }

    [Fact]
    public void NowUtc_Test()
    {
        Provider.Setup(p => p.GetUtcNow()).Returns(255m);
        EvaluateAndExpect("DateTime.UtcNow", 255m);
    }

    [Fact]
    public void TimeOfDayUtc_Test()
    {
        Provider.Setup(p => p.GetUtcTimeOfDay()).Returns(658m);
        EvaluateAndExpect("DateTime.UtcTimeOfDay", 658m);
    }

    [Fact]
    public void DayOfWeek_Test()
    {
        Provider.Setup(p => p.GetDayOfWeek()).Returns("Monday");
        EvaluateAndExpect("DateTime.DayOfWeek", "Monday");
    }

    [Fact]
    public void Today_Test()
    {
        Provider.Setup(p => p.GetToday()).Returns(255m);
        EvaluateAndExpect("DateTime.Today", 255m);
    }

    [Fact]
    public void Now_Test()
    {
        Provider.Setup(p => p.GetNow()).Returns(658m);
        EvaluateAndExpect("DateTime.Now", 658m);
    }

    [Fact]
    public void TimeOfDay_Test()
    {
        Provider.Setup(p => p.GetTimeOfDay()).Returns(369m);
        EvaluateAndExpect("DateTime.TimeOfDay", 369m);
    }

    [Fact]
    public void UtcDate_Test()
    {
        Provider.Setup(p => p.UtcDate(2018, 5, 36)).Returns(180536m);
        EvaluateAndExpect("DateTime.UtcDate(2018, 5, 36)", 180536m);
    }

    [Fact]
    public void Date_Test()
    {
        Provider.Setup(p => p.Date(2018, 5, 36)).Returns(180536m);
        EvaluateAndExpect("DateTime.Date(2018, 5, 36)", 180536m);
    }

    [Fact]
    public void UtcDateTime_Test()
    {
        Provider.Setup(p => p.UtcDateTime(2018, 5, 36, 22, 19)).Returns(1805362219m);
        EvaluateAndExpect("DateTime.UtcDateTime(2018, 5, 36, 22, 19)", 1805362219m);
    }

    [Fact]
    public void UtcDateTime_FromStringFormat_Test()
    {
        Provider.Setup(p => p.UtcDateTime("2018-5-36 22:19:00", "yyyy-MM-dd HH:mm:ss")).Returns(1805362219m);
        EvaluateAndExpect("DateTime.UtcDateTime('2018-5-36 22:19:00', 'yyyy-MM-dd HH:mm:ss')", 1805362219m);
    }

    [Fact]
    public void UtcDateTime_FromString_Test()
    {
        Provider.Setup(p => p.UtcDateTime("2018-5-36 22:19:00", "")).Returns(1805362219m);
        EvaluateAndExpect("DateTime.UtcDateTime('2018-5-36 22:19:00', '')", 1805362219m);
    }

    [Fact]
    public void DateTime_Test()
    {
        Provider.Setup(p => p.DateTime(2018, 5, 36, 22, 19)).Returns(1805362219m);
        EvaluateAndExpect("DateTime.DateTime(2018, 5, 36, 22, 19)", 1805362219m);
    }

    [Fact]
    public void Time_Test()
    {
        Provider.Setup(p => p.Time(22, 19)).Returns(2219m);
        EvaluateAndExpect("DateTime.Time(22, 19)", 2219m);
    }
}
