using System;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Configuration;

public sealed class CultureSerializerTests
{
    private ICultureSerializer target;

    public CultureSerializerTests()
    {
        target = new CultureSerializer();
    }

    [Fact]
    public void Serializer_ShouldThrowWhenDeserializationFails()
    {
        var culture = new CultureInfo("en-US");

        Assert.Throws<JsonReaderException>(() => target.DeserializeAndPopulateOverride(culture, CreateFaultyCultureOverride()));
    }

    [Fact]
    public void Serializer_IgnoreNullValues()
    {
        var culture = new CultureInfo("en-US");
        var cultureOverride = JObject.Parse(@"{""NumberFormat"": {""PercentSymbol"": null}}");

        target.DeserializeAndPopulateOverride(culture, cultureOverride);

        culture.NumberFormat.PercentSymbol.Should().Be("%");
    }

    [Fact]
    public void Serializer_IgnoreIncorrectProperty()
    {
        var culture = new CultureInfo("en-US");
        var cultureOverride = JObject.Parse(@"{""NumberFormat"": {""XercentXymbol"": ""$""}}");

        target.DeserializeAndPopulateOverride(culture, cultureOverride);

        culture.NumberFormat.PercentSymbol.Should().Be("%");
    }

    [Fact]
    public void Serializer_ShouldApplyPartialOverride()
    {
        var culture = new CultureInfo("en-US");

        target.DeserializeAndPopulateOverride(culture, CreatePartialOverride());

        culture.DateTimeFormat.DateSeparator.Should().Be("-");
        culture.DateTimeFormat.ShortDatePattern.Should().Be("DD.MM.yyyy");
        culture.NumberFormat.CurrencyDecimalDigits.Should().Be(5);
    }

    [Fact]
    public void Serializer_ShouldApplyAllSupportedOverrides()
    {
        var culture = new CultureInfo("en-US");

        target.DeserializeAndPopulateOverride(culture, CreateFullCultureOverride());

        culture.Calendar.TwoDigitYearMax.Should().Be(9999);

        culture.NumberFormat.CurrencyDecimalDigits.Should().Be(5);
        culture.NumberFormat.CurrencyDecimalSeparator.Should().Be("_");
        culture.NumberFormat.CurrencyGroupSeparator.Should().Be("_");
        culture.NumberFormat.CurrencyGroupSizes.Should().BeEquivalentTo(new[] { 4 });
        culture.NumberFormat.NumberGroupSizes.Should().BeEquivalentTo(new[] { 5 });
        culture.NumberFormat.PercentGroupSizes.Should().BeEquivalentTo(new[] { 6 });
        culture.NumberFormat.CurrencySymbol.Should().Be("%");
        culture.NumberFormat.NaNSymbol.Should().Be("~");
        culture.NumberFormat.CurrencyNegativePattern.Should().Be(1);
        culture.NumberFormat.NumberNegativePattern.Should().Be(2);
        culture.NumberFormat.PercentPositivePattern.Should().Be(3);
        culture.NumberFormat.PercentNegativePattern.Should().Be(3);
        culture.NumberFormat.NegativeInfinitySymbol.Should().Be("-~");
        culture.NumberFormat.NegativeSign.Should().Be("_");
        culture.NumberFormat.NumberDecimalDigits.Should().Be(3);
        culture.NumberFormat.NumberDecimalSeparator.Should().Be("-");
        culture.NumberFormat.NumberGroupSeparator.Should().Be(";");
        culture.NumberFormat.CurrencyPositivePattern.Should().Be(1);
        culture.NumberFormat.PositiveInfinitySymbol.Should().Be("+~");
        culture.NumberFormat.PositiveSign.Should().Be("#");
        culture.NumberFormat.PercentDecimalDigits.Should().Be(3);
        culture.NumberFormat.PercentDecimalSeparator.Should().Be(";");
        culture.NumberFormat.PercentGroupSeparator.Should().Be("-");
        culture.NumberFormat.PercentSymbol.Should().Be("$");
        culture.NumberFormat.PerMilleSymbol.Should().Be("$$");
        culture.NumberFormat.DigitSubstitution.Should().Be(DigitShapes.NativeNational);
        culture.NumberFormat.NativeDigits.Should().BeEquivalentTo(new[] { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" });

        culture.DateTimeFormat.AMDesignator.Should().Be("xy");
        culture.DateTimeFormat.DateSeparator.Should().Be("-");
        culture.DateTimeFormat.FirstDayOfWeek.Should().Be(DayOfWeek.Friday);
        culture.DateTimeFormat.CalendarWeekRule.Should().Be(CalendarWeekRule.FirstFourDayWeek);
        culture.DateTimeFormat.FullDateTimePattern.Should().Be("DDDD, mmmm D, YYYY H:MM:SS TT");
        culture.DateTimeFormat.LongDatePattern.Should().Be("DDDD, mmmm D, YYYY");
        culture.DateTimeFormat.LongTimePattern.Should().Be("H:MM:SS TT");
        culture.DateTimeFormat.MonthDayPattern.Should().Be("mmmm D");
        culture.DateTimeFormat.PMDesignator.Should().Be("zy");
        culture.DateTimeFormat.ShortDatePattern.Should().Be("DD.MM.yyyy");
        culture.DateTimeFormat.ShortTimePattern.Should().Be("H:MM TT");
        culture.DateTimeFormat.TimeSeparator.Should().Be("-");
        culture.DateTimeFormat.YearMonthPattern.Should().Be("mmmm YYYY");
        culture.DateTimeFormat.AbbreviatedDayNames.Should().BeEquivalentTo(new[] { "Xun", "Xon", "Xue", "Xed", "Xhu", "Xri", "Xat" });
        culture.DateTimeFormat.AbbreviatedMonthGenitiveNames.Should()
            .BeEquivalentTo(new[] { "Xan", "Xeb", "Xar", "Xpr", "Xay", "Xun", "Xul", "Xug", "Xep", "Xct", "Xov", "Xec", "" });
        culture.DateTimeFormat.AbbreviatedMonthNames.Should()
            .BeEquivalentTo(new[] { "Xan", "Xeb", "Xar", "Xpr", "Xay", "Xun", "Xul", "Xug", "Xep", "Xct", "Xov", "Xec", "" });
        culture.DateTimeFormat.MonthGenitiveNames.Should()
            .BeEquivalentTo(new[] { "Xan", "Xeb", "Xar", "Xpr", "Xay", "Xun", "Xul", "Xug", "Xep", "Xct", "Xov", "Xec", "" });
        culture.DateTimeFormat.MonthNames.Should().BeEquivalentTo(new[] { "Xan", "Xeb", "Xar", "Xpr", "Xay", "Xun", "Xul", "Xug", "Xep", "Xct", "Xov", "Xec", "" });
        culture.DateTimeFormat.DayNames.Should().BeEquivalentTo(new[] { "Xun", "Xon", "Xue", "Xed", "Xhu", "Xri", "Xat" });
        culture.DateTimeFormat.ShortestDayNames.Should().BeEquivalentTo(new[] { "Xu", "Xo", "Xy", "Xe", "Xh", "Xr", "Xa" });
    }

    private JObject CreateFullCultureOverride()
    {
        return JObject.Parse(
            @"
            {
                ""Calendar"": {
                    ""TwoDigitYearMax"": 9999
                },
                ""NumberFormat"": {
                    ""CurrencyDecimalDigits"": 5,
                    ""CurrencyDecimalSeparator"": ""_"",
                    ""CurrencyGroupSeparator"": ""_"",
                    ""CurrencyGroupSizes"": [4],
                    ""NumberGroupSizes"": [5],
                    ""PercentGroupSizes"": [6],
                    ""CurrencySymbol"": ""%"",
                    ""NaNSymbol"": ""~"",
                    ""CurrencyNegativePattern"": 1,
                    ""NumberNegativePattern"": 2,
                    ""PercentPositivePattern"": 3,
                    ""PercentNegativePattern"": 3,
                    ""NegativeInfinitySymbol"": ""-~"",
                    ""NegativeSign"": ""_"",
                    ""NumberDecimalDigits"": 3,
                    ""NumberDecimalSeparator"": ""-"",
                    ""NumberGroupSeparator"": "";"",
                    ""CurrencyPositivePattern"": 1,
                    ""PositiveInfinitySymbol"": ""+~"",
                    ""PositiveSign"": ""#"",
                    ""PercentDecimalDigits"": 3,
                    ""PercentDecimalSeparator"": "";"",
                    ""PercentGroupSeparator"": ""-"",
                    ""PercentSymbol"": ""$"",
                    ""PerMilleSymbol"": ""$$"",
                    ""DigitSubstitution"": ""NativeNational"",
                    ""NativeDigits"": [""٠"",""١"",""٢"",""٣"",""٤"",""٥"",""٦"",""٧"",""٨"",""٩""]
                },
                ""DateTimeFormat"": {
                    ""AMDesignator"": ""xy"",
                    ""DateSeparator"": ""-"",
                    ""FirstDayOfWeek"": ""Friday"",
                    ""CalendarWeekRule"": ""FirstFourDayWeek"",
                    ""FullDateTimePattern"": ""DDDD, mmmm D, YYYY H:MM:SS TT"",
                    ""LongDatePattern"": ""DDDD, mmmm D, YYYY"",
                    ""LongTimePattern"": ""H:MM:SS TT"",
                    ""MonthDayPattern"": ""mmmm D"",
                    ""PMDesignator"": ""zy"",
                    ""ShortDatePattern"": ""DD.MM.yyyy"",
                    ""ShortTimePattern"": ""H:MM TT"",
                    ""TimeSeparator"": ""-"",
                    ""YearMonthPattern"": ""mmmm YYYY"",
                    ""AbbreviatedDayNames"": [""Xun"",""Xon"",""Xue"",""Xed"",""Xhu"",""Xri"",""Xat""],
                    ""AbbreviatedMonthGenitiveNames"": [""Xan"",""Xeb"", ""Xar"", ""Xpr"", ""Xay"", ""Xun"", ""Xul"", ""Xug"", ""Xep"", ""Xct"", ""Xov"", ""Xec"", """"],
                    ""AbbreviatedMonthNames"": [""Xan"",""Xeb"", ""Xar"", ""Xpr"", ""Xay"", ""Xun"", ""Xul"", ""Xug"", ""Xep"", ""Xct"", ""Xov"", ""Xec"", """"],
                    ""MonthGenitiveNames"": [""Xan"",""Xeb"", ""Xar"", ""Xpr"", ""Xay"", ""Xun"", ""Xul"", ""Xug"", ""Xep"", ""Xct"", ""Xov"", ""Xec"", """"],
                    ""MonthNames"": [""Xan"",""Xeb"", ""Xar"", ""Xpr"", ""Xay"", ""Xun"", ""Xul"", ""Xug"", ""Xep"", ""Xct"", ""Xov"", ""Xec"", """"],
                    ""DayNames"": [""Xun"",""Xon"",""Xue"",""Xed"",""Xhu"",""Xri"",""Xat""],
                    ""ShortestDayNames"": [""Xu"",""Xo"",""Xy"",""Xe"",""Xh"",""Xr"",""Xa""],
                }
            }");
    }

    private JObject CreatePartialOverride()
    {
        return JObject.Parse(@"{""NumberFormat"": {""CurrencyDecimalDigits"": 5}, ""DateTimeFormat"": {""DateSeparator"": ""-"", ""ShortDatePattern"": ""DD.MM.yyyy""}}");
    }

    private JObject CreateFaultyCultureOverride()
    {
        return JObject.Parse(@"{""NumberFormat"": {""CurrencyDecimalDigits"": ""foo""}}");
    }
}
