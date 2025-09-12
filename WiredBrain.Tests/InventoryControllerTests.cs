using Microsoft.AspNetCore.Mvc;
using Moq;
using WiredBrainApi;
using WiredBrainApi.Controllers;
using WiredBrainApi.Services;

namespace WiredBrain.Tests
{
    public class InventoryControllerTests
    {
        [Fact]
        public void GetWithValidID_Returns_200WithJson()
        {
            var mockService = new Mock<IInventoryService>();
            mockService
                .Setup(service => service.GetLocationInventory(It.IsAny<int>()))
                .Returns((int id) => new LocationInventory
                {
                    Id = id,
                    LocationName = "Main Street",
                    KgDarkRoast = 5.8m,
                    KgLightRoast = 10.0m,
                    KgMediumRoast = 7.5m,
                    KgSeasonalRoast = 0.0m
                }
            );

            var controller = new InventoryController(mockService.Object);
            var result = controller.Get(1);

            Assert.IsType<ActionResult<LocationInventory>>(result);
            Assert.NotNull(result.Value);
        }

        [Fact]
        public void GetWithInvalidID_Returns_NotFound()
        {
            var mockService = new Mock<IInventoryService>();
            mockService
                .Setup(service => service.GetLocationInventory(It.IsAny<int>()))
                .Returns((int id) => null);

            var controller = new InventoryController(mockService.Object);
            var result = controller.Get(-1);

            Assert.IsType<NotFoundResult>(result.Result);            
        }
    }
}