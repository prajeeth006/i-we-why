#nullable disable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Content;
using Microsoft.Extensions.Logging;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
namespace Frontend.Vanilla.Features.TermsAndConditions;

public interface ITermsAndConditionsContentProvider
{
    void SetReplacementList(IEnumerable<KeyValuePair<string, string>> replaceableKeyValuePairs);

    string GetTncContent(string templateId, string miscTemplateId);

    IEnumerable<KeyValuePair<string, string>> ApplyCulturalFormatOnMetaData(
        IEnumerable<KeyValuePair<string, string>> replaceableKeyValuePairs);

    string ParseBratResultTemplate(IEnumerable<KeyValuePair<string, string>> replaceableValues,
        string bonusTemplate);

    string GetcampaignTncContent(string templateId, string miscTemplateId = null);

    string GetContentFromReleaseCriteriaStaticKeys();

    string ParseTemplateAndReplacePlaceholders(IEnumerable<KeyValuePair<string, string>> replaceableValues, string bonusTemplate);

    IEnumerable<KeyValuePair<string, string>> GetReplacementList();
    void SetOddsBootsAndRiskFreeBetReplacement(bool shouldCallPosApi = false);
}

internal sealed class TermsAndConditionsContentProvider(
    IContentService contentService,
    ITermsAndConditionsConfiguration configuration,
    IPosApiCommonService posApiCommonService,
    IPosApiContentService posApiContentService,
    ILogger<TermsAndConditionsContentProvider> log)
    : ITermsAndConditionsContentProvider
{
    private const string StaticKey = "#STATIC_";
    private const string FormatKey = "#FORMAT_";
    private const string FormatAmountKey = "#FORMAT_AMOUNT_";
    private const string FormatDateKey = "#FORMAT_DATE_";
    private const string FormatEmptyKey = "#FORMAT_EMPTY_";
    private static readonly string[] DefaultContentDateFormat = { "dd/MM/yyyy hh:mm tt", "dd/MM/yyyy hh:mm:ss tt" };
    private const string ReleaseCriteriaStaticKey = "#RELEASE_CRITERIA_STATIC_KEY#";
    private const string ApplicableProductsKey = "#APPLICABLE_ALL_PRODUCTS#";
    private const string EligibilityCriteriaTemplateKey = "#SPORTS_GVB_ELIGIBILITY_CRITERIA#";
    private const string BratIncludedCountries = "#BRAT_INCLUDED_COUNTRIES#";

    private IEnumerable<KeyValuePair<string, string>> ReplaceableKeyValuePairs { get; set; }

    public void SetReplacementList(IEnumerable<KeyValuePair<string, string>> replaceableKeyValuePairs)
    {
        ReplaceableKeyValuePairs = replaceableKeyValuePairs != null ? replaceableKeyValuePairs.ToList() : new List<KeyValuePair<string, string>>();

        if (ReplaceableKeyValuePairs.Any(k => k.Key.Contains(BratIncludedCountries))) LoadAndReplaceCountriesNames();
        if (ReplaceableKeyValuePairs.Any(k => k.Key.StartsWith(StaticKey))) LoadAndReplaceStaticKeyValuePairs();
        if (ReplaceableKeyValuePairs.Any(k => k.Key.StartsWith(ApplicableProductsKey)))
            LoadAndReplaceApplicableProductsKey();
    }

    /// <summary>
    /// Fetch translations or set default values for odds boost and risk free bet league/sport/event names.
    /// </summary>
    /// <param name="shouldCallPosApi">Identify if should fetch translations from pos api or just set default values.</param>
    public void SetOddsBootsAndRiskFreeBetReplacement(bool shouldCallPosApi = false)
    {
        ReplaceableKeyValuePairs ??= new List<KeyValuePair<string, string>>();

        if (ReplaceableKeyValuePairs.Any(k => configuration.OddsBoostKeyValues.ContainsKey(k.Key)))
            LoadOddsBoostAndRiskFreeBetKeyValuePairs(configuration.OddsBoostKeyValues, shouldCallPosApi);
        if (ReplaceableKeyValuePairs.Any(k => configuration.RiskFreeBetKeyValues.ContainsKey(k.Key)))
            LoadOddsBoostAndRiskFreeBetKeyValuePairs(configuration.RiskFreeBetKeyValues, shouldCallPosApi);
    }

    /// <summary>
    /// Prepares Static Content.
    /// </summary>
    private void LoadAndReplaceStaticKeyValuePairs()
    {
        var documentId = new DocumentId(configuration.StaticKeyValues,
            DocumentPathRelativity.AbsoluteRoot);

        try
        {
            var staticKeysCmsValues = contentService.Get<IViewTemplate>(documentId);

            var replaceableKeysDictionary = ReplaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            var replaceableKeysList = replaceableKeysDictionary.Keys.ToList();
            replaceableKeysList.Where(x => x.StartsWith(StaticKey)).ToList().ForEach(x =>
            {
                var staticKeyValue = replaceableKeysDictionary[x] ?? string.Empty;
                replaceableKeysDictionary[x] = staticKeysCmsValues != null && staticKeysCmsValues.Messages.ContainsKey(staticKeyValue)
                    ? staticKeysCmsValues.Messages[staticKeyValue]
                    : staticKeyValue;
            });
            ReplaceableKeyValuePairs = replaceableKeysDictionary;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed loading {documentId} from sitecore", documentId);
        }
    }

    private void LoadOddsBoostAndRiskFreeBetKeyValuePairs(IReadOnlyDictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> keyArray, bool shouldCallPosApi)
    {
        try
        {
            // fetch default values
            var defaultKeyValuePairs = contentService.Get<IViewTemplate>("MobileLogin-v1.0/Inbox/TNCSection/DEFAULT/DefaultKeyValues");
            var replaceableKeysDictionary = ReplaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            foreach (var key in keyArray)
            {
                var replaceableKeyValuePair = ReplaceableKeyValuePairs.FirstOrDefault(keyValuePair => keyValuePair.Key.Equals(key.Value.Name));

                // if key is not present in replaceableKeyValuePair or value of placeholder is null or empty, use default value
                if (string.IsNullOrEmpty(replaceableKeyValuePair.Value))
                {
                    ReplaceDefaultKeyValuePairs(defaultKeyValuePairs, key, replaceableKeysDictionary);

                    continue;
                }

                if (!shouldCallPosApi) continue;

                try
                {
                    // try to fetch value from pos api
                    var value = ExecutionMode.ExecuteSync(posApiContentService.GetTranslationAsync(ExecutionMode.Sync, key.Value.Type, replaceableKeyValuePair.Value));
                    replaceableKeysDictionary[key.Value.Name] = value.Name;
                }
                catch
                {
                    // use default values
                    ReplaceDefaultKeyValuePairs(defaultKeyValuePairs, key, replaceableKeysDictionary);
                }
            }

            ReplaceableKeyValuePairs = replaceableKeysDictionary;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "LoadOddsBoostAndRiskFreeBetKeyValuePairs failed");
        }
    }

    /// <summary>
    /// Format Date and Amount Values as per Culture.
    /// </summary>
    public IEnumerable<KeyValuePair<string, string>> ApplyCulturalFormatOnMetaData(
        IEnumerable<KeyValuePair<string, string>> replaceableKeyValuePairs)
    {
        try
        {
            var replaceableKeysDictionary = replaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            var replaceableKeysList = replaceableKeysDictionary.Keys.ToList();
            replaceableKeysList.Where(x => x.StartsWith(FormatKey)).ToList().ForEach(
                x =>
                {
                    try
                    {
                        if (x.StartsWith(FormatAmountKey))
                        {
                            var modifiedCurrentCulture = new CultureInfo(Thread.CurrentThread.CurrentCulture.Name);
                            var amountArray = replaceableKeysDictionary[x].Split('_');

                            if (amountArray.Length == 2)
                            {
                                var amountValue = Convert.ToDecimal(amountArray[0], CultureInfo.InvariantCulture);
                                modifiedCurrentCulture.NumberFormat.CurrencySymbol = amountArray[1];

                                replaceableKeysDictionary[x.Replace(FormatAmountKey, "#")] =
                                    amountValue.ToString("C", modifiedCurrentCulture);
                            }
                        }
                        else if (x.StartsWith(FormatDateKey))
                        {
                            var dateArray = replaceableKeysDictionary[x].Split('_');

                            if (dateArray.Length == 2)
                            {
                                var dateTime = DateTime.ParseExact(dateArray[0], DefaultContentDateFormat, CultureInfo.InvariantCulture);

                                replaceableKeysDictionary[x.Replace(FormatDateKey, "#")] =
                                    dateTime.ToString("g", Thread.CurrentThread.CurrentCulture) + " " +
                                    dateArray[1];
                            }
                        }
                        else if (x.StartsWith(FormatEmptyKey))
                        {
                            var key = x.Replace(FormatEmptyKey, "#");

                            if (!replaceableKeysList.Contains(key))
                            {
                                replaceableKeysDictionary[key] = string.Empty;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        log.LogError(ex, "Error while formatting Date and Amount fields for key {key} and value {value}", x, replaceableKeysDictionary[x]);
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

    /// <summary>
    /// Prepares Terms and Condition Content.
    /// </summary>
    /// <param name="templateId"></param>
    /// <param name="miscTemplateId"></param>
    /// <returns></returns>
    public string GetTncContent(string templateId, string miscTemplateId = null)
    {
        try
        {
            if ((templateId == null && miscTemplateId == null) ||
                configuration.TncSectionByTemplateId == null)
            {
                return null;
            }

            var templateValue = configuration.TncSectionByTemplateId.FirstOrDefault(s => s.Key == templateId);
            // eg:LAND_TNC_POKER_CR_FB_1_1_RH
            var tncPath = templateValue.Value ??
                          string.Format(configuration.TncSectionTemplate, templateId?.Split('_')[2], templateId?.Split('_')[3], templateId);
            var miscPath = new List<string>();

            if (miscTemplateId != null)
            {
                var miscTemplates = miscTemplateId.Trim().Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                miscPath.AddRange(
                    from template in miscTemplates
                    let miscTemplateValue =
                        configuration.TncSectionByTemplateId.FirstOrDefault(s => s.Key == template)
                    select miscTemplateValue.Value ??
                           string.Format(configuration.MiscTncSectionTemplate, template));
            }

            var tncContentFromSpecifiedPath = LoadTncContentFromSpecifiedPath(tncPath);
            var tncContentFromSpecifiedMiscellaneousPaths = LoadTncContentFromMiscellaneousPaths(miscPath);

            var tncContent = string.Empty;
            var tncTemplateContent =
                ParseTncResultTemplate(tncContentFromSpecifiedPath, ReplaceableKeyValuePairs);
            var miscTemplateContent =
                ParseTncResultTemplate(tncContentFromSpecifiedMiscellaneousPaths, ReplaceableKeyValuePairs);
            var releaseCriteriaContent =
                ParseResultTemplate(ReplaceableKeyValuePairs, GetContentFromReleaseCriteriaStaticKeys());

            if (!string.IsNullOrWhiteSpace(tncTemplateContent)) tncContent = tncContent + tncTemplateContent;
            if (!string.IsNullOrWhiteSpace(releaseCriteriaContent))
                tncContent = tncContent + releaseCriteriaContent;
            if (!string.IsNullOrWhiteSpace(miscTemplateContent)) tncContent = tncContent + miscTemplateContent;

            if (ReplaceableKeyValuePairs.Any(k => k.Key.StartsWith(EligibilityCriteriaTemplateKey)))
            {
                var eligibilityCriteriaText = GetEligibilityCriteriaTnC();
                tncContent = tncContent + eligibilityCriteriaText;
            }

            return tncContent;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error occurred trying to load TNC Content from Sitecore");

            return null;
        }
    }

    public string ParseBratResultTemplate(IEnumerable<KeyValuePair<string, string>> replaceableValues, string bonusTemplate)
    {
        return ParseResultTemplate(replaceableValues, bonusTemplate);
    }

    /// <summary>
    /// Prepares Terms and Condition Content.
    /// </summary>
    /// <param name="templateId"></param>
    /// <param name="miscTemplateId"></param>
    /// <returns></returns>
    public string GetcampaignTncContent(string templateId, string miscTemplateId = null)
    {
        if (templateId == null || miscTemplateId == null)
        {
            return null;
        }

        var tncPath = string.Format(configuration.CampaignTncSectionTemplate, templateId); // eg:LAND_TNC_POKER_CR_FB_1_1_RH
        var miscPath = new List<string>();

        var miscTemplates = miscTemplateId.Trim().Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        miscPath.AddRange(from template in miscTemplates
            select string.Format(configuration.CampaignMiscTncSectionTemplate, template));

        // var tncContent = LoadTncContent(tncpath, miscPath);
        var tncContentFromSpecifiedPath = LoadTncContentFromSpecifiedPath(tncPath);
        var tncContentFromSpecifiedMiscellaneousPaths = LoadTncContentFromMiscellaneousPaths(miscPath);

        var tncContent = string.Empty;
        var tncTemplateContent = ParseTncResultTemplate(tncContentFromSpecifiedPath, ReplaceableKeyValuePairs);
        var miscTemplateContent = ParseTncResultTemplate(tncContentFromSpecifiedMiscellaneousPaths, ReplaceableKeyValuePairs);
        var releaseCriteriaContent = ParseResultTemplate(ReplaceableKeyValuePairs, GetContentFromReleaseCriteriaStaticKeys());

        if (!string.IsNullOrWhiteSpace(tncTemplateContent)) tncContent = tncContent + tncTemplateContent;
        if (!string.IsNullOrWhiteSpace(releaseCriteriaContent)) tncContent = tncContent + releaseCriteriaContent;
        if (!string.IsNullOrWhiteSpace(miscTemplateContent)) tncContent = tncContent + miscTemplateContent;

        if (ReplaceableKeyValuePairs.Any(k => k.Key.StartsWith(EligibilityCriteriaTemplateKey)))
        {
            var eligibilityCriteriaText = GetEligibilityCriteriaTnC();
            tncContent = tncContent + eligibilityCriteriaText;
        }

        return tncContent;
    }

    private string GetEligibilityCriteriaTnC()
    {
        var eligibilityCriteriaTemplateId = ReplaceableKeyValuePairs
            .Single(keyValuePair => keyValuePair.Key.Equals(EligibilityCriteriaTemplateKey)).Value;

        try
        {
            if (!string.IsNullOrEmpty(eligibilityCriteriaTemplateId))
            {
                return "<ul><li>" +
                       contentService.Get<IViewTemplate>(new DocumentId(eligibilityCriteriaTemplateId,
                           DocumentPathRelativity.AbsoluteRoot))?.Title + "</li></ul>";
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error occurred trying to load {eligibityCriteriaTemplateId} from Sitecore", eligibilityCriteriaTemplateId);

            return string.Empty;
        }

        return string.Empty;
    }

    public string GetContentFromReleaseCriteriaStaticKeys()
    {
        try
        {
            var releaseCriteriaStaticKeyValuePair =
                ReplaceableKeyValuePairs.SingleOrDefault(keyValuePair => keyValuePair.Key.Equals(ReleaseCriteriaStaticKey));

            if (releaseCriteriaStaticKeyValuePair.Value == null)
            {
                return string.Empty;
            }

            var valueOfKeysObtainedThroughReleaseCriteriaStaticKey = releaseCriteriaStaticKeyValuePair.Value;

            var documentId =
                new DocumentId(configuration.StaticKeyValues,
                    DocumentPathRelativity.AbsoluteRoot);
            var staticKeysCmsValues = contentService.Get<IViewTemplate>(documentId);

            var builtValueFromCms = string.Empty;

            if (!string.IsNullOrWhiteSpace(valueOfKeysObtainedThroughReleaseCriteriaStaticKey))
            {
                var keys = valueOfKeysObtainedThroughReleaseCriteriaStaticKey.Split(',');

                foreach (var key in keys)
                {
                    var contentOfKey = staticKeysCmsValues != null && staticKeysCmsValues.Messages.ContainsKey(key) ? staticKeysCmsValues.Messages[key] : key;
                    builtValueFromCms = string.Concat(builtValueFromCms, " ", contentOfKey);
                }
            }

            if (builtValueFromCms.Trim() == "")
                builtValueFromCms = "<ul><li>" + valueOfKeysObtainedThroughReleaseCriteriaStaticKey + "</li></ul>";
            else
                builtValueFromCms = "<ul><li>" + builtValueFromCms + "</li></ul>";

            return builtValueFromCms;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error occurred trying to load TNC Content from Sitecore");

            return string.Empty;
        }
    }

    public IEnumerable<KeyValuePair<string, string>> GetReplacementList()
    {
        return ReplaceableKeyValuePairs;
    }

    private IEnumerable<IPCText> LoadTncContentFromSpecifiedPath(string path)
    {
        try
        {
            var documentId = new DocumentId(configuration.AbsoluteContentRoot + path,
                DocumentPathRelativity.AbsoluteRoot);
            var messagesFolder = contentService.Get<IPCContainer>(documentId);

            var tncContent = messagesFolder?.Items.Select(id => contentService.Get<IPCText>(id))
                .ToArray();

            return tncContent;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error occurred trying to load TNC Content from {path}", path);

            return null;
        }
    }

    /// <summary>
    /// Load IPCText from specified list of miscellaneous paths.
    /// </summary>
    /// <param name="miscPath"></param>
    /// <returns>IEnumerable&lt;Content&lt;IPCText&gt;&gt;.</returns>
    private IEnumerable<IPCText> LoadTncContentFromMiscellaneousPaths(IEnumerable<string> miscPath = null)
    {
        try
        {
            miscPath = RetrieveValidMiscellaneousPaths(miscPath);
            var miscTncContent = new List<IPCText>().ToArray();

            if (miscPath != null)
            {
                miscTncContent =
                    miscPath
                        .Select(miscTemplatePath => contentService.Get<IPCContainer>(
                            new DocumentId(configuration.AbsoluteContentRoot + miscTemplatePath, DocumentPathRelativity.AbsoluteRoot)))
                        .Select(miscMessagesFolder =>
                            miscMessagesFolder?.Items.Select(id => contentService.Get<IPCText>(id)).ToArray())
                        .Aggregate(miscTncContent, (current, miscContent) => Enumerable.Concat(current, miscContent).ToArray());
            }

            return miscTncContent;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error occurred trying to load TNC Content from {path}", miscPath?.Join());

            return null;
        }
    }

    /// <summary>
    /// It will ignore the miscellaneous paths which are invalid to avoid failing entire thing because of atleast one invalid path.
    /// </summary>
    /// <param name="miscPath"></param>
    /// <returns></returns>
    private IEnumerable<string> RetrieveValidMiscellaneousPaths(IEnumerable<string> miscPath = null)
    {
        IEnumerable<string> tempMiscPath = Array.Empty<string>();
        var miscPathList = miscPath?.ToList();

        try
        {
            for (var i = 0; i < miscPathList?.Count; i++)
            {
                try
                {
                    var item = contentService.GetContent<IPCContainer>(new DocumentId(configuration.AbsoluteContentRoot + miscPathList[i],
                        DocumentPathRelativity.AbsoluteRoot));
                    if (item.Status == DocumentStatus.Success)
                        tempMiscPath = Enumerable.Concat(tempMiscPath, new[] { miscPathList[i] });
                    else
                        log.LogError("RetrieveValidMiscellaneousPaths failed with {path}", miscPathList[i]);
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "RetrieveValidMiscellaneousPaths failed with {path}", miscPathList[i]);
                }
            }

            return tempMiscPath;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "RetrieveValidMiscellaneousPaths failed");

            return null;
        }
    }

    /// <summary>
    ///  Parses string and updates placeholders.
    /// </summary>
    /// <param name="replaceableValues"></param>
    /// <param name="bonusTemplate"></param>
    /// <returns></returns>
    public string ParseTemplateAndReplacePlaceholders(IEnumerable<KeyValuePair<string, string>> replaceableValues, string bonusTemplate)
        => ParseResultTemplate(replaceableValues, bonusTemplate);

    /// <summary>
    /// Parses Templates placeholders and replaces with values.
    /// </summary>
    /// <param name="templates"></param>
    /// <param name="replaceableValues"></param>
    /// <returns></returns>
    private static string ParseTncResultTemplate(IEnumerable<IPCText> templates,
        IEnumerable<KeyValuePair<string, string>> replaceableValues)
    {
        if (templates == null) return string.Empty;

        // In case of filter applied for any template then it does not loads and value become null which causes null exception.
        var pcTexts = templates.Where(x => x != null);

        var builder = new StringBuilder();

        foreach (var item in pcTexts)
        {
            builder.AppendLine(item.Text);
        }

        return ParseResultTemplate(replaceableValues, builder.ToString());
    }

    /// <summary>
    ///  Parses string and updates placeholders.
    /// </summary>
    /// <param name="replaceableValues"></param>
    /// <param name="bonusTemplate"></param>
    /// <returns></returns>
    private static string ParseResultTemplate(IEnumerable<KeyValuePair<string, string>> replaceableValues,
        string bonusTemplate)
    {
        var builder = new StringBuilder();
        builder.AppendLine(bonusTemplate);

        var keyValuePairs = replaceableValues as IList<KeyValuePair<string, string>> ?? replaceableValues.ToList();
        keyValuePairs.Each(i => builder.Replace(i.Key, i.Value));

        // if placeholders exist in static keys from sitecore replace them
        if (builder.ToString().Contains("#"))
        {
            keyValuePairs.Each(i => builder.Replace(i.Key, i.Value));
        }

        return builder.ToString();
    }

    /// <summary>
    /// Prepares Product Keys Content.
    /// </summary>
    private void LoadAndReplaceApplicableProductsKey()
    {
        try
        {
            var documentId =
                new DocumentId(configuration.StaticKeyValues,
                    DocumentPathRelativity.AbsoluteRoot);
            var releaseCriteriaStaticKeyValuePair = contentService.Get<IViewTemplate>(documentId);
            var applicableProductKeys = ReplaceableKeyValuePairs
                .Single(keyValuePair => keyValuePair.Key.Equals(ApplicableProductsKey)).Value;
            var applicableKeyProductsList = applicableProductKeys.Trim()
                .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            var builder = new StringBuilder().ToString();

            foreach (var s in applicableKeyProductsList)
            {
                var temp = releaseCriteriaStaticKeyValuePair?.Messages[s.Trim()];
                builder = builder + temp + ", ";
            }

            builder = builder.Length >= 2 ? builder.Substring(0, builder.Length - 2) : builder;

            var replaceableKeysDictionary = ReplaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            var replaceableKeysList = replaceableKeysDictionary.Keys.ToList();
            replaceableKeysList.Where(x => x.Equals(ApplicableProductsKey)).ToList().ForEach(x => { replaceableKeysDictionary[x] = builder; });
            ReplaceableKeyValuePairs = replaceableKeysDictionary;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "LoadAndReplaceApplicableProductsKey failed");
        }
    }

    private void LoadAndReplaceCountriesNames()
    {
        try
        {
            var bratIncludedCountriesKeyValuePair =
                ReplaceableKeyValuePairs.Single(keyValuePair => keyValuePair.Key.Equals(BratIncludedCountries));

            if (bratIncludedCountriesKeyValuePair.Value == null) return;

            var countriesCodes = bratIncludedCountriesKeyValuePair.Value.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(c => c.Trim()).ToList();

            if (!countriesCodes.Any()) return;

            var countries = posApiCommonService.GetAllCountries();
            var countriesNames = Enumerable.Join(countries, countriesCodes, c => c.Id, cc => cc, (c, _) => c).Select(c => c.Name).Join(", ");
            var replaceableKeyValuePairs = ReplaceableKeyValuePairs.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            replaceableKeyValuePairs[BratIncludedCountries] = countriesNames;
            ReplaceableKeyValuePairs = replaceableKeyValuePairs;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "LoadAndReplaceCountryNames failed");
        }
    }

    private static void ReplaceDefaultKeyValuePairs(
        IViewTemplate defaultKeyValuePairs,
        KeyValuePair<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> key,
        IDictionary<string, string> replaceableKeysDictionary)
    {
        var trimmedKey = key.Value.Name.Value.Trim('#');
        replaceableKeysDictionary[key.Value.Name] = defaultKeyValuePairs != null && defaultKeyValuePairs.Messages.ContainsKey(trimmedKey)
            ? defaultKeyValuePairs.Messages[trimmedKey]
            : string.Empty;
    }
}
