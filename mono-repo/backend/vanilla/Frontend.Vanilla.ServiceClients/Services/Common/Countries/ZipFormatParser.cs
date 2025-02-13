using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Countries;

internal static class ZipFormatParser
{
    public static ZipFormat Parse(string pattern)
    {
        try
        {
            if (string.IsNullOrEmpty(pattern))
                return ParseStandardFormat("AAAaaaaaa"); // Default pattern

            return pattern.TrimStart().StartsWith("RAW")
                ? ParseRawFormat(pattern)
                : ParseStandardFormat(pattern);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed parsing ZIP format: " + pattern, ex);
        }
    }

    private static readonly IReadOnlyDictionary<char, string> ConversionMap = new Dictionary<char, string>
    {
        { 'd', "\\d" },
        { 'l', "[a-zA-Z]" },
        { 'a', "[0-9a-zA-Z]" },
        { 's', "\\s" },
        { 'x', "[ 0-9a-zA-Z]" },
    };

    private static ZipFormat ParseStandardFormat(string pattern)
    {
        var sb = new StringBuilder();

        foreach (var c in pattern)
        {
            if (!ConversionMap.TryGetValue(char.ToLower(c), out var regex))
                throw new Exception($"Unsupported character '{c}' in standard ZIP format. Supported chars (can be upper-case): {string.Concat(ConversionMap.Keys)}");

            sb.Append(regex);
            if (char.IsLower(c)) // Lower case indicates that the char is optional
                sb.Append("?");
        }

        sb.Insert(0, "(?=^").Append("$)"); // Value has to match previous pattern from start to end using positive lookahead
        sb.Append(@"(?!.*\s\s)"); // Additionally check there are no multiple whitespaces using negative lookahead

        return new ZipFormat(
            minLength: pattern.Count(char.IsUpper),
            maxLength: pattern.Length,
            regex: sb.ToString());
    }

    private static readonly Regex RawFormatRegex = new Regex(@"^\s*RAW\s*\(\s*(?<min>\d+)\s*,\s*(?<max>\d+)\s*,\s*/(?<regex>.*)/\s*\)\s*$", RegexOptions.Compiled);

    private static ZipFormat ParseRawFormat(string pattern)
    {
        var rawMatch = RawFormatRegex.Match(pattern);

        if (!rawMatch.Success)
            throw new Exception("Invalid raw ZIP format. Expected format: 'RAW(123, 456, /any-regex-chars/)' where 123 is min length and 456 is max length.");

        var result = new ZipFormat(
            minLength: int.Parse(rawMatch.Groups["min"].Value),
            maxLength: int.Parse(rawMatch.Groups["max"].Value),
            regex: rawMatch.Groups["regex"].Value);

        if (result.MaxLength < result.MinLength)
            throw new Exception($"MaxLength = {result.MaxLength} must be greater or equal to MinLength = {result.MinLength}");

        return result;
    }
}
