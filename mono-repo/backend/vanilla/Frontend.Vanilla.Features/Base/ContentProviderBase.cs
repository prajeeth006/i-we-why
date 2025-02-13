#nullable disable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Globalization;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Base;

internal abstract class ContentProviderBase<T>(IContentService contentService, ILogger log, IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    : IContentProvider<T>
    where T : class
{
    public virtual string MessageSource => "generic";
    private const string FormatKey = "#FORMAT_";
    private const string FormatAmountKey = "#FORMAT_AMOUNT_";
    private const string FormatDateKey = "#FORMAT_DATE_";
    private const string FormatEmptyKey = "#FORMAT_EMPTY_";
    private static readonly string[] DefaultContentDateFormat = { "dd/MM/yyyy hh:mm tt", "dd/MM/yyyy hh:mm:ss tt" };
    private const string StaticKey = "#STATIC_";

    public abstract string StaticContentPath { get; }

    public virtual T GetContent(string itemId, IReadOnlyDictionary<string, string> templateMetaData)
    {
        var offerDoc =
            contentService.Get<IDocument>(new DocumentId(itemId, DocumentPathRelativity.AbsoluteRoot));

        if (offerDoc == null)
        {
            log.LogError("Failed to load content {ItemId} for inbox or RTMS message", itemId);

            return null;
        }

        // replace static-s
        var staticKeysValues = contentService.Get<IViewTemplate>(StaticContentPath);
        var replaceableKeysDictionary =
            templateMetaData.OrderBy(x => x.Key.StartsWith(StaticKey)).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

        foreach (var x in replaceableKeysDictionary.Keys.Where(x => x.StartsWith(StaticKey)).ToList())
        {
            var staticKeyValue = replaceableKeysDictionary[x];
            replaceableKeysDictionary[x] =
                staticKeysValues != null && staticKeysValues.Messages.ContainsKey(staticKeyValue) ? staticKeysValues.Messages[staticKeyValue] : staticKeyValue;
        }

        return GenerateResult(replaceableKeysDictionary, offerDoc);
    }

    public virtual string ResolveMessage(Dictionary<string, string> replaceableKeysDictionary, string msgItem)
        => Format(replaceableKeysDictionary, msgItem);

    protected abstract T GenerateResult(Dictionary<string, string> replaceableKeysDictionary, IDocument offerDoc);

    /// <summary>
    /// make replace all known html tags and check result on IsNullOrWhiteSpace.
    /// </summary>
    protected bool IsHtmlContentEmpty(string msgItemStr)
    {
        if (string.IsNullOrWhiteSpace(msgItemStr)) return true;

        var document = new HtmlDocument();
        document.LoadHtml(msgItemStr);

        return string.IsNullOrWhiteSpace(HtmlEntity.DeEntitize(document.DocumentNode.InnerText));
    }

    private string Format(IEnumerable<KeyValuePair<string, string>> templateMetaData, string data)
    {
        var metaData = ApplyCulturalFormatOnMetaData(templateMetaData) ?? templateMetaData;

        if (metaData != null && !string.IsNullOrEmpty(data))
        {
            return metaData.Aggregate(data, (prev, pair) => prev.Replace(pair.Key, pair.Value));
        }

        return data;
    }

    private IEnumerable<KeyValuePair<string, string>> ApplyCulturalFormatOnMetaData(
        IEnumerable<KeyValuePair<string, string>> replaceableKeyValuePairs)
    {
        try
        {
            var replaceableKeysDictionary = replaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            replaceableKeysDictionary.Keys.Where(x => x.StartsWith(FormatKey)).ToList().ForEach(
                formatKey =>
                {
                    try
                    {
                        if (formatKey.StartsWith(FormatAmountKey))
                        {
                            var modifiedCurrentCulture = new CultureInfo(Thread.CurrentThread.CurrentCulture.Name);
                            var amountArray = replaceableKeysDictionary[formatKey].Split('_');

                            if (amountArray.Length == 2)
                            {
                                var amountValue = Convert.ToDecimal(amountArray[0], CultureInfo.InvariantCulture);
                                modifiedCurrentCulture.NumberFormat.CurrencySymbol = amountArray[1];

                                replaceableKeysDictionary[formatKey.Replace(FormatAmountKey, "#")] =
                                    amountValue.ToString("C", modifiedCurrentCulture);
                            }
                        }
                        else if (formatKey.StartsWith(FormatDateKey))
                        {
                            var dateArray = replaceableKeysDictionary[formatKey].Split('_');

                            if (dateArray.Length != 2) return;

                            var dateTime = DateTime.ParseExact(dateArray[0], DefaultContentDateFormat, CultureInfo.InvariantCulture);
                            var userFormattedDate = dateTimeCultureBasedFormatter.Format(dateTime);

                            replaceableKeysDictionary[formatKey.Replace(FormatDateKey, "#")] = $"{userFormattedDate} {dateArray[1]}";
                        }
                        else if (formatKey.StartsWith(FormatEmptyKey))
                        {
                            var key = formatKey.Replace(FormatEmptyKey, "#");

                            if (!replaceableKeysDictionary.ContainsKey(key))
                            {
                                replaceableKeysDictionary[key] = string.Empty;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        log.LogError(
                            ex,
                            "Error while formatting Date and Amount fields for key {Key} and value {Value}",
                            formatKey,
                            replaceableKeysDictionary[formatKey]);
                    }
                });

            return replaceableKeysDictionary;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error while formatting Date and Amount fields");

            return null;
        }
    }
}
