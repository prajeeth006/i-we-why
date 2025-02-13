using System;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.ServiceModel;
using System.Text;
using FluentAssertions;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Services.Mail;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using AlternateView = System.Net.Mail.AlternateView;
using Attachment = System.Net.Mail.Attachment;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Mail;

public class MailServiceTests
{
    private IMailService target;
    private EmailServiceProxy clientProxy;
    private MailMessage message;
    private TestLogger<MailService<EmailServiceProxy>> log;

    public MailServiceTests()
    {
        var config = Mock.Of<IMailConfiguration>(c => c.EndpointAddress == new Uri("http://mail.ws.intranet/EmailServiceV1.svc"));
        clientProxy = new EmailServiceProxy();
        log = new TestLogger<MailService<EmailServiceProxy>>();
        target = new MailService<EmailServiceProxy>(config, () => clientProxy, log);

        message = new MailMessage
        {
            From = new MailAddress("vanilla-unittests@bwin.org"),
            Subject = "Vanilla IMailService Integration Test",
            Body = "Success",
        };
        message.To.Add(new MailAddress("philippe.auchlin@bwin.org"));
    }

    [Fact]
    public void SendMessageShallSucceed()
        => target.SendEmail(message).Should().BeTrue();

    [Fact]
    public void SendMessageWithAlternateViewShallSucceed()
    {
        var stream = new MemoryStream(Encoding.UTF8.GetBytes("Alternate View"));
        message.AlternateViews.Add(new AlternateView(stream));

        // Act
        target.SendEmail(message).Should().BeTrue();
    }

    [Fact]
    public void SendMessageWithAttachementShallSucceed()
    {
        var stream = new MemoryStream(Encoding.UTF8.GetBytes("Attachment"));
        var attachment = new Attachment(stream, new ContentType(ContentTypes.Text));
        message.Attachments.Add(attachment);

        // Act
        target.SendEmail(message).Should().BeTrue();
    }

    [Fact]
    public void OnSuccessChannelShallBeClosed()
    {
        var channel = new Mock<IClientChannel>();
        channel.Setup(s => s.Close()).Throws(new FaultException());
        clientProxy.InnerChannel = channel.Object;

        // Act
        target.SendEmail(message);

        channel.Verify(x => x.Close(), Times.Once());
    }

    [Theory]
    [InlineData(typeof(FaultException))]
    [InlineData(typeof(TimeoutException))]
    public void SendMessagesShallAbortProxyAndLogOnFaultOrTimeoutException(Type exceptionType)
    {
        var channel = new Mock<IClientChannel>();
        channel.Setup(s => s.Close()).Throws((Exception)Activator.CreateInstance(exceptionType));
        clientProxy.InnerChannel = channel.Object;

        // Act
        var response = target.SendEmail(message);

        response.Should().BeFalse();
        log.Logged.Single().Verify(
            LogLevel.Error,
            ex => exceptionType.IsInstanceOfType(ex),
            ("@emailRequest", new SendEmailRequestType
            {
                From = "vanilla-unittests@bwin.org",
                To = new[] { "philippe.auchlin@bwin.org" },
                Cc = new string[0],
                Bcc = new string[0],
                Subject = "Vanilla IMailService Integration Test",
                Body = "Success",
                Attachments = new ServiceClients.Services.Mail.Attachment[0],
                AlternateViews = new ServiceClients.Services.Mail.AlternateView[0],
            }));
        channel.Verify(s => s.Abort(), Times.Once);
    }

    private sealed class EmailServiceProxy : WcfFakeProxy, EmailServicePort
    {
        public SendEmailResponse SendEmail(SendEmailRequest request)
        {
            return new SendEmailResponse(new SendEmailResponseType { MessageId = "Fake" });
        }
    }
}
