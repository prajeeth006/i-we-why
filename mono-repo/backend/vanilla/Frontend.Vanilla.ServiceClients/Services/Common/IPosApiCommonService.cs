using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Cities;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.ServiceClients.Services.Common.List;
using Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;
using Frontend.Vanilla.ServiceClients.Services.Common.Timezones;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common;

/// <summary>
/// Represents Common.svc PosAPI service.
/// </summary>
public interface IPosApiCommonService
{
    [DelegateTo(typeof(ICitiesServiceClient), nameof(ICitiesServiceClient.GetAsync))]
    IReadOnlyList<City> GetCities(string countryId = null, string countryAreaId = null);

    [DelegateTo(typeof(ICitiesServiceClient), nameof(ICitiesServiceClient.GetAsync))]
    Task<IReadOnlyList<City>> GetCitiesAsync(CancellationToken cancellationToken, string countryId = null, string countryAreaId = null);

    [DelegateTo(typeof(IClientInformationServiceClient), nameof(IClientInformationServiceClient.GetAsync))]
    ClientInformation GetClientInformation();

    [DelegateTo(typeof(IClientInformationServiceClient), nameof(IClientInformationServiceClient.GetAsync))]
    Task<ClientInformation> GetClientInformationAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ICountriesServiceClient), nameof(ICountriesServiceClient.GetAsync))]
    IReadOnlyList<Country> GetCountries();

    [DelegateTo(typeof(ICountriesServiceClient), nameof(ICountriesServiceClient.GetAsync))]
    Task<IReadOnlyList<Country>> GetCountriesAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ICountriesServiceClient), nameof(ICountriesServiceClient.GetAllAsync))]
    IReadOnlyList<Country> GetAllCountries();

    [DelegateTo(typeof(ICountriesServiceClient), nameof(ICountriesServiceClient.GetAllAsync))]
    Task<IReadOnlyList<Country>> GetAllCountriesAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ICountryAreasServiceClient), nameof(ICountryAreasServiceClient.GetAsync))]
    IReadOnlyList<CountryArea> GetCountryAreas(string countryId = null);

    [DelegateTo(typeof(ICountryAreasServiceClient), nameof(ICountryAreasServiceClient.GetAsync))]
    Task<IReadOnlyList<CountryArea>> GetCountryAreasAsync(CancellationToken cancellationToken, string countryId = null);

    [DelegateTo(typeof(ICurrenciesServiceClient), nameof(ICurrenciesServiceClient.GetAsync))]
    IReadOnlyList<Currency> GetCurrencies();

    [DelegateTo(typeof(ICurrenciesServiceClient), nameof(ICurrenciesServiceClient.GetAsync))]
    Task<IReadOnlyList<Currency>> GetCurrenciesAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IHistoricalCountriesServiceClient), nameof(IHistoricalCountriesServiceClient.GetAsync))]
    IReadOnlyList<HistoricalCountry> GetHistoricalCountries(UtcDateTime? date = null);

    [DelegateTo(typeof(IHistoricalCountriesServiceClient), nameof(IHistoricalCountriesServiceClient.GetAsync))]
    Task<IReadOnlyList<HistoricalCountry>> GetHistoricalCountriesAsync(CancellationToken cancellationToken, UtcDateTime? date = null);

    [DelegateTo(typeof(IListServiceClient), nameof(IListServiceClient.GetAsync))]
    IReadOnlyList<string> GetList(string listName);

    [DelegateTo(typeof(IListServiceClient), nameof(IListServiceClient.GetAsync))]
    Task<IReadOnlyList<string>> GetListAsync([NotNull] string listName, CancellationToken cancellationToken);

    [DelegateTo(typeof(ICountryMobilePredialsServiceClient), nameof(ICountryMobilePredialsServiceClient.GetAsync))]
    IReadOnlyList<CountryMobilePredial> GetCountryMobilePredials(string countryPredial = null);

    [DelegateTo(typeof(ICountryMobilePredialsServiceClient), nameof(ICountryMobilePredialsServiceClient.GetAsync))]
    Task<IReadOnlyList<CountryMobilePredial>> GetCountryMobilePredialsAsync(CancellationToken cancellationToken, string countryPredial = null);

    [DelegateTo(typeof(ISecurityQuestionsServiceClient), nameof(ISecurityQuestionsServiceClient.GetAsync))]
    IReadOnlyList<SecurityQuestion> GetSecurityQuestions();

    [DelegateTo(typeof(ISecurityQuestionsServiceClient), nameof(ISecurityQuestionsServiceClient.GetAsync))]
    Task<IReadOnlyList<SecurityQuestion>> GetSecurityQuestionsAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ITimezonesServiceClient), nameof(ITimezonesServiceClient.GetAsync))]
    IReadOnlyList<Timezone> GetTimezones();

    [DelegateTo(typeof(ITimezonesServiceClient), nameof(ITimezonesServiceClient.GetAsync))]
    Task<IReadOnlyList<Timezone>> GetTimezonesAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ILanguagesServiceClient), nameof(ILanguagesServiceClient.GetCachedAsync))]
    IReadOnlyList<Language> GetLanguages();

    [DelegateTo(typeof(ILanguagesServiceClient), nameof(ILanguagesServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<Language>> GetLanguagesAsync(CancellationToken cancellationToken);
}

internal interface IPosApiCommonServiceInternal : IPosApiCommonService
{
    [DelegateTo(typeof(IApplicationInformationServiceClient), nameof(IApplicationInformationServiceClient.GetAsync))]
    ApplicationInformation GetApplicationInformation(string platform = null, string appId = null, string country = null);

    [DelegateTo(typeof(IApplicationInformationServiceClient), nameof(IApplicationInformationServiceClient.GetAsync))]
    Task<ApplicationInformation> GetApplicationInformationAsync(CancellationToken cancellationToken, string platform = null, string appId = null, string country = null);

    [DelegateTo(typeof(ILanguagesServiceClient), nameof(ILanguagesServiceClient.GetFreshAsync))]
    Task<IReadOnlyList<Language>> GetFreshLanguagesAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IListServiceClient), nameof(IListServiceClient.GetAsync))]
    Task<IReadOnlyList<string>> GetListAsync(ExecutionMode mode, [NotNull] string listName);

    [DelegateTo(typeof(IInventoryServiceClient), nameof(IInventoryServiceClient.GetShopDetailsAsync))]
    Task<ShopDetailsResponse> GetShopDetailsAsync(ExecutionMode mode, string shopId, bool cached = true);

    [DelegateTo(typeof(IInventoryServiceClient), nameof(IInventoryServiceClient.GetTerminalDetailsAsync))]
    Task<TerminalDetailsResponse> GetTerminalDetailsAsync(ExecutionMode mode, TerminalDetailsRequest request);
}
