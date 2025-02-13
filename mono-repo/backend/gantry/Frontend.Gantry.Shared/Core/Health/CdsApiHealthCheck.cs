using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;

namespace Frontend.Gantry.Shared.Core.Health
{
	public class CdsApiHealthCheck : IHealthCheck
	{
		public HealthCheckMetadata Metadata { get; } = new HealthCheckMetadata(
			"CDS Api Health",
			$"Checks the CDS Api health page. Please find ApiHealthUrl in Details.",
			"Ask CDS Team (Team Nitro).",
			HealthCheckSeverity.Critical);

		private const string CdsApiHealthPage = "c.aspx";
		private const string CdsApiHealthCheckSuccess = "CHECK_OK";
		private readonly ICDSConfig _cdsConfiguration;

		public CdsApiHealthCheck(ICDSConfig cdsConfiguration)
		{
			_cdsConfiguration = cdsConfiguration;
		}

		public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
		{
			var url = $"{_cdsConfiguration.CdsApiUrl}/{CdsApiHealthPage}";
			var watch = Stopwatch.StartNew();

			bool okay;
			string statusDescription;

			try
			{
				var client = new HttpClient();

				var response = await client.GetAsync(url, cancellationToken);

				response.EnsureSuccessStatusCode();

				statusDescription = await response.Content.ReadAsStringAsync();

				okay = statusDescription == CdsApiHealthCheckSuccess;
			}
			catch (Exception exception)
			{
				okay = false;
				statusDescription = exception.Message;
			}
			watch.Stop();

			var details = new
			{
				LatencyInMs = watch.ElapsedMilliseconds,
				//we must not use "CHECK_OK", because of the way LeanOps monitoring works
				Status = "OK",
				ApiHealthUrl = url
			};

			return okay ? HealthCheckResult.CreateSuccess(details) : HealthCheckResult.CreateFailed(statusDescription, details);
		}

		public bool IsEnabled => true;
	}
}