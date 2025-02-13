namespace Frontend.Vanilla.Features.Login.ErrorFormatters;

internal interface ILoginErrorConverter
{
    object Convert(object value, ErrorHandlerParameter parameter);
}
