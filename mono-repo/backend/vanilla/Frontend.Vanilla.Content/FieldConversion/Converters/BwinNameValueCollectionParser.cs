using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Parser of bwin name value collection.
/// </summary>
public interface IBwinNameValueCollectionParser
{
    /// <summary>
    /// Parses a string representing a collection of name-value pairs from bwin format.
    /// </summary>
    [NotNull]
    IReadOnlyList<(string Key, string Value)> Parse([CanBeNull] string fieldValue);
}

/// <summary>
/// Parses a string reprsenting a collection of name-value pairs from Bwin format.
/// </summary>
public sealed class BwinNameValueCollectionParser : IBwinNameValueCollectionParser
{
    private static readonly XmlReaderSettings Settings = new XmlReaderSettings
    {
        IgnoreComments = true,
        IgnoreProcessingInstructions = true,
        IgnoreWhitespace = true,
    };

    /// <summary>
    /// Parses the provided Bwin-formatted string and extracts the name-value pairs.
    /// </summary>
    public IReadOnlyList<(string Key, string Value)> Parse(string fieldValue)
    {
        if (string.IsNullOrWhiteSpace(fieldValue))
            return Array.Empty<(string, string)>();

        using (var stringReader = new StringReader(fieldValue))
        using (var reader = XmlReader.Create(stringReader, Settings))
        {
            if (!reader.ReadToFollowing("entry"))
                return Array.Empty<(string, string)>();

            var result = new List<(string, string)>();

            while (true)
            {
                var key = reader.GetAttribute("key");

                if (string.IsNullOrWhiteSpace(key))
                    throw new FormatException("Null or white-space keys are not allowed but there is such key.");

                result.Add((key, reader.ReadString()));

                if (!reader.ReadToNextSibling("entry"))
                    return result;
            }
        }
    }
}
